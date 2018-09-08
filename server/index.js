import path from 'path';
import cors from 'cors';
import express from 'express';
import {
    fileLoader,
    mergeTypes,
    mergeResolvers
} from 'merge-graphql-schemas';
import bodyParser from 'body-parser';
import { ApolloServer } from 'apollo-server-express';

import models from './models';

const typeDefs = mergeTypes(fileLoader(path.join(__dirname, "./graphql/schema")));
const resolvers = mergeResolvers(fileLoader(path.join(__dirname, "./graphql/resolvers")));
const server = new ApolloServer({
    typeDefs,
    resolvers,
    context: {
        models,
        user: { id: 1 }
    }
});

const app = express();
app.use(cors());
app.use(bodyParser.json());
server.applyMiddleware({ app });

const greetings = () => console.log(`
🚀 Server ready at http://localhost:4000${server.graphqlPath}
`)
models.sequelize.sync({ /* force: true */ }).then(() => {
    app.listen({ port: 4000 }, greetings);
});


