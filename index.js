import express from 'express';
import bodyParser from 'body-parser';
import { ApolloServer } from 'apollo-server-express';

import typeDefs from './graphql/schema';
import resolvers from './graphql/resolvers';
import models from './models';

const server = new ApolloServer({ typeDefs, resolvers });
const app = express();
app.use(bodyParser.json());
server.applyMiddleware({ app });

const greetings = () => console.log(`
🚀 Server ready at http://localhost:4000${server.graphqlPath}
`)

models.sequelize.sync({ force: true }).then(() => {
    app.listen({ port: 4000 }, greetings)
})

