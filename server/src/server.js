import http from 'http';
import Debug from 'debug';
import {
    makeExecutableSchema,
} from 'graphql-tools';
import {
    fileLoader,
    mergeTypes,
    mergeResolvers,
} from 'merge-graphql-schemas';
import {
    ApolloServer,
} from 'apollo-server-express';

import {
    fileStderr,
} from './helpers';
import {
    checkSubscriptionAuth,
} from './auth';
import {
    getRegularLoaders,
    subscriptionLoaders,
} from './dataLoaders';
import app from './app';
import conf from '../config';
import models from './models';
import emailTransporter from './email';

const debug = Debug('corporate-messenger:server');

const schema = makeExecutableSchema({
    typeDefs: mergeTypes(fileLoader(conf.apollo.schemasPath)),
    resolvers: mergeResolvers(fileLoader(conf.apollo.resolversPath)),
});

/* server instanse */

const apollo = new ApolloServer({
    schema,
    engine: {
        apiKey: conf.apollo.engineKey,
    },
    context: ({
        req,
        connection,
    }) => {
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
        path: conf.apollo.subscriptions_path,
        keepAlive: 1,
        onConnect: async ({
            token,
            refreshToken,
        }) => {
            const user = await checkSubscriptionAuth(models, token, refreshToken);
            // debug(`Subscription ${token} client ${user.id}`);
            return {
                user,
            };
        },
        onDisconnect: o => debug(`Subscription client ${o} disconnected.`),
    },
});

/* allow extra logging */

if (conf.is_logging) {
    apollo.requestOptions.formatError = (error) => {
        debug(error);
        fileStderr(error.message);
        return error;
    };

    apollo.requestOptions.formatResponse = (response) => {
        debug(response);
        return response;
    };
}

/* set all up */

apollo.applyMiddleware({
    app,
});

const server = http.createServer(app);

apollo.installSubscriptionHandlers(server);

/* start */

setImmediate(async () => {
    try {
        if (conf.is_db_drop) {
            await models.sequelize.drop();
        }

        await models.sequelize.sync();
        await server.listen(conf.port);

        debug(`🚀 at http://localhost:${conf.port}${apollo.graphqlPath}`);
        debug(`Subscriptions 🚀 at ws://localhost:${conf.port}${apollo.subscriptionsPath}`);
    } catch (e) {
        debug(e);
    }
});
