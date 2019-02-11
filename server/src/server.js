// process.env.NODE_ENV = 'test';

import path from 'path';
import http from 'http';
import Debug from 'debug';
import dotenv from 'dotenv';
import {
    fileLoader,
    mergeTypes,
    mergeResolvers,
} from 'merge-graphql-schemas';
import DataLoader from 'dataloader';
import nodemailer from 'nodemailer';
import { ApolloServer } from 'apollo-server-express';
import { makeExecutableSchema } from 'graphql-tools';

import app from './app';
import models from './models';
import loaders from './loaders';
import { checkSubscriptionAuth } from './auth';

dotenv.config({
    path: path.join(__dirname, '../', `.env.${process.env.NODE_ENV || 'production'}`),
});

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
const regularLoaders = {
    file: new DataLoader(ids => loaders.file(ids, models)),
    sender: new DataLoader(ids => loaders.sender(ids, models)),
    admin: new DataLoader(ids => loaders.admin(ids, models)),
    member: new DataLoader(ids => loaders.member(ids, models)),
    membersCount: new DataLoader(ids => loaders.membersCount(ids, models)),
    participant: new DataLoader(ids => loaders.participant(ids, models)),
    channelFilesCount: new DataLoader(ids => loaders.channelFilesCount(ids, models)),
    channelMessagesCount: new DataLoader(ids => loaders.channelMessagesCount(ids, models)),
    participantsCount: new DataLoader(ids => loaders.participantsCount(ids, models)),
};
const subscriptionLoaders = {
    sender: new DataLoader(ids => loaders.sender(ids, models)),
    file: new DataLoader(ids => loaders.file(ids, models)),
};
const getRegularLoaders = req => ({
    ...regularLoaders,
    channel: new DataLoader(ids => loaders.channel(ids, models, req.user)),
    teamUpdatesCount: new DataLoader(ids => loaders.teamUpdatesCount(ids, models, req.user)),
    channelUpdatesCount: new DataLoader(ids => loaders.channelUpdatesCount(ids, models, req.user)),
});

const apollo = new ApolloServer({
    schema,
    context: ({ req, connection }) => {
        if (connection) {
            return {
                ...connection.context,
                models,
                loaders: subscriptionLoaders,
            };
        }
        return {
            models,
            user: req.user,
            referrer: req.headers.origin,
            loaders: getRegularLoaders(req),
            emailTransporter,
        };
    },
    subscriptions: {
        path: SUBSCRIPTIONS_PATH,
        keepAlive: 1,
        onConnect: async ({ token, refreshToken }) => {
            const user = await checkSubscriptionAuth(models, token, refreshToken);
            debug(`Subscription ${token} client ${user.id} connected via new SubscriptionServer.`);
            return { user };
        },
        onDisconnect: () => debug('Subscription client disconnected.'),
    },
});

apollo.applyMiddleware({ app });

const server = http.createServer(app);
apollo.installSubscriptionHandlers(server);

setImmediate(async () => {
    try {
        if (IS_FORCE) {
            await models.sequelize.drop();
            await models.sequelize.sync();
        }
        await server.listen(PORT);
        debug(`🚀 at http://localhost:${PORT}${apollo.graphqlPath}`);
        debug(`Subscriptions 🚀 at ws://localhost:${PORT}${apollo.subscriptionsPath}`);
    } catch (e) {
        debug(e);
    }
});
