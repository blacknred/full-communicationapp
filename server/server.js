import path from 'path';
import http from 'http';
import Debug from 'debug';
import {
    fileLoader,
    mergeTypes,
    mergeResolvers,
} from 'merge-graphql-schemas';
import { execute, subscribe } from 'graphql';
import { ApolloServer } from 'apollo-server-express';
import { makeExecutableSchema } from 'graphql-tools';
import { SubscriptionServer } from 'subscriptions-transport-ws';

import app from './app';
import models from './models';
import { checkAuth2 } from './auth';

const PORT = process.env.PORT || 3000;
const debug = Debug('corporate-messenger:server');
const IS_FORCE = process.env.NODE_ENV === 'test' ? { force: true } : null;

const typeDefs = mergeTypes(fileLoader(path.join(__dirname, './graphql/schema')));
const resolvers = mergeResolvers(fileLoader(path.join(__dirname, './graphql/resolvers')));
const schema = makeExecutableSchema({
    typeDefs,
    resolvers,
});
const apollo = new ApolloServer({
    schema,
    context: async ({ req }) => ({
        models,
        user: req.user,
    }),
});
apollo.applyMiddleware({ app });

const server = http.createServer(app);

// run
models.sequelize.sync(IS_FORCE).then(() => server
    .listen({ port: PORT }, () => {
        // eslint-disable-next-line no-new
        new SubscriptionServer(
            {
                execute,
                subscribe,
                schema,
                onConnect: async ({ token, refreshToken }, webSocket) => {
                    const user = await checkAuth2(models, token, refreshToken);
                    debug(`Subscription client ${user.id} connected via new SubscriptionServer.`);
                    return { models, user };
                },
                onDisconnect: async (webSocket, context) => {
                    debug('Subscription client disconnected.');
                },
                // onOperation: () => {
                //     console.log('ws');
                //     return {};
                // },
            },
            {
                server,
                path: '/graphql',
            },
        );
        debug(`🚀 at http://localhost:${PORT}${apollo.graphqlPath}`);
        debug(`Subscriptions 🚀 at ws://localhost:${PORT}${apollo.subscriptionsPath}`);
    }));
