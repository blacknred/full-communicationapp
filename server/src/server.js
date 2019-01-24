import path from 'path';
import http from 'http';
import Debug from 'debug';
import DataLoader from 'dataloader';
import nodemailer from 'nodemailer';
import { ApolloServer } from 'apollo-server-express';
import { makeExecutableSchema } from 'graphql-tools';
import { fileLoader, mergeTypes, mergeResolvers } from 'merge-graphql-schemas';

import app from './app';
import models from './models';
import loaders from './loaders';
import { checkSubscriptionAuth } from './auth';

const PORT = process.env.PORT || 3000;
const SUBSCRIPTIONS_PATH = '/subscriptions';
const IS_FORCE = process.env.NODE_ENV === 'test';
const debug = Debug('corporate-messenger:server');

const typeDefs = mergeTypes(fileLoader(path.join(__dirname, './graphql/schema')));
const resolvers = mergeResolvers(fileLoader(path.join(__dirname, './graphql/resolvers')));
const schema = makeExecutableSchema({ typeDefs, resolvers });
const emailTransporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_PASSWORD,
    },
});

const apollo = new ApolloServer({
    schema,
    context: ({ req, connection }) => {
        if (connection) {
            return {
                ...connection.context,
                models,
                loaders: {
                    sender: new DataLoader(ids => loaders.sender(ids, models)),
                    file: new DataLoader(ids => loaders.file(ids, models)),
                },
            };
        }
        return {
            models,
            user: req.user,
            loaders: {
                file: new DataLoader(ids => loaders.file(ids, models)),
                sender: new DataLoader(ids => loaders.sender(ids, models)),
                channel: new DataLoader(ids => loaders.channel(ids, models, req.user)),
            },
            emailTransporter,
        };
    },
    subscriptions: {
        path: SUBSCRIPTIONS_PATH,
        keepAlive: 1,
        onConnect: async ({ token, refreshToken }) => {
            const user = await checkSubscriptionAuth(models, token, refreshToken);
            debug(`Subscription client ${user.id} connected via new SubscriptionServer.`);
            return { user };
        },
        onDisconnect: async () => debug('Subscription client disconnected.'),
    },
});

apollo.applyMiddleware({ app });

const server = http.createServer(app);
apollo.installSubscriptionHandlers(server);

models.sequelize.sync(IS_FORCE && { force: true })
    .then(() => server.listen({ port: PORT }, () => {
        debug(`🚀 at http://localhost:${PORT}${apollo.graphqlPath}`);
        debug(`Subscriptions 🚀 at ws://localhost:${PORT}${apollo.subscriptionsPath}`);
    }));
