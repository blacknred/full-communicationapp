import path from 'path';
import cors from 'cors';
import express from 'express';
import {
    fileLoader,
    mergeTypes,
    mergeResolvers,
} from 'merge-graphql-schemas';
import bodyParser from 'body-parser';
import { ApolloServer } from 'apollo-server-express';

import jwt from 'jsonwebtoken';

import models from './models';
import { refreshTokens } from './auth';

const typeDefs = mergeTypes(fileLoader(path.join(__dirname, './graphql/schema')));
const resolvers = mergeResolvers(fileLoader(path.join(__dirname, './graphql/resolvers')));

const SECRET = process.env.TOKEN_SECRET;
const SECRET2 = process.env.TOKEN_SECRET_2;

const checkUser = async (req, res, next) => {
    const token = req.headers['x-token'];
    if (token) {
        try {
            const { user } = jwt.verify(token, SECRET);
            req.user = user;
            console.log('user', req.user);
        } catch (err) {
            const refreshToken = req.headers['x-refresh-token'];
            const newTokens = await refreshTokens({
                token, refreshToken, models, SECRET, SECRET2,
            });
            if (newTokens.token && newTokens.refreshToken) {
                res.set('Access-Control-Expose-Headers', 'x-token, x-refresh-token');
                res.set('x-token', newTokens.token);
                res.set('x-refresh-token', newTokens.refreshToken);
            }
        }
    }
    next();
};

const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(checkUser);

const server = new ApolloServer({
    typeDefs,
    resolvers,
    context: async ({ req }) => ({
        models,
        user: req.user,
        SECRET,
        SECRET2,
    }),
});

server.applyMiddleware({ app });

const greetings = () => console.log(`
🚀 Server ready at http://localhost:4000${server.graphqlPath}
`);
models.sequelize.sync({ /* force: true */ }).then(() => {
    app.listen({ port: 4000 }, greetings);
});
