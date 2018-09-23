import path from 'path';
import http from 'http';
import Debug from 'debug';
import {
    fileLoader,
    mergeTypes,
    mergeResolvers,
} from 'merge-graphql-schemas';
import jwt from 'jsonwebtoken';
import { execute, subscribe } from 'graphql';
import { ApolloServer } from 'apollo-server-express';
import { makeExecutableSchema } from 'graphql-tools';
import { SubscriptionServer } from 'subscriptions-transport-ws';

import app from './app';
import models from './models';
import { refreshTokens } from './auth';

const PORT = process.env.PORT || 3000;
const SECRET = process.env.TOKEN_SECRET;
const SECRET2 = process.env.TOKEN_SECRET_2;
const debug = Debug('corporate-messenger:server');

const typeDefs = mergeTypes(fileLoader(path.join(__dirname, './graphql/schema')));
const resolvers = mergeResolvers(fileLoader(path.join(__dirname, './graphql/resolvers')));
const schema = makeExecutableSchema({
    typeDefs,
    resolvers,
});
const apollo = new ApolloServer({
    schema,
    context: async ({ req }) => {
        // if (connection) {
        //     console.log('ws');
        //     return {};
        // }
        return {
            models,
            user: req.user,
            SECRET,
            SECRET2,
        };
    },
    // tracing: true,
    // subscriptions: {
    //     path: '/graphql',
    //     onConnect: async ({ token, refreshToken }, webSocket) => {
    //         let curUser = null;
    //         if (token && refreshToken) {
    //             try {
    //                 const { user } = jwt.verify(token, SECRET);
    //                 curUser = user;
    //             } catch (err) {
    //                 const { user } = await refreshTokens({
    //                     token, refreshToken, models, SECRET, SECRET2,
    //                 });
    //                 curUser = user;
    //             }
    //             debug('ws client connected using Apollo server built-in SubscriptionServer.');
    //             console.log(curUser);
    //             return { models, user: curUser };
    //         }
    //         return { models };
    //     },
    //     onDisconnect: async (webSocket, context) => {
    //         debug('Subscription client disconnected.');
    //     },
    // },
});
apollo.applyMiddleware({ app });

const server = http.createServer(app);
// apollo.installSubscriptionHandlers(server);
// run
models.sequelize.sync({}).then(() => server
    .listen({ port: PORT }, () => {
        // eslint-disable-next-line no-new
        new SubscriptionServer(
            {
                execute,
                subscribe,
                schema,
                onConnect: async ({ token, refreshToken }, webSocket) => {
                    let curUser = null;
                    if (token && refreshToken) {
                        try {
                            const { user } = jwt.verify(token, SECRET);
                            curUser = user;
                        } catch (err) {
                            const { user } = await refreshTokens({
                                token, refreshToken, models, SECRET, SECRET2,
                            });
                            curUser = user;
                        }
                        debug(`Subscription client ${curUser.id} connected via new SubscriptionServer.`);
                        return { models, user: curUser };
                    }
                    return { models };
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
