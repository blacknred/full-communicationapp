import express from 'express';
import bodyParser from 'body-parser';
const { ApolloServer } = require('apollo-server-express');

import typeDefs from './graphql/schema';
import resolvers from './graphql/resolvers';

const server = new ApolloServer({ typeDefs, resolvers });
const app = express();
app.use(bodyParser.json())
server.applyMiddleware({ app });

app.listen({ port: 4000 }, () =>
    console.log(`🚀 Server ready at http://localhost:4000${server.graphqlPath}`)
);
