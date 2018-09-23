// import ApolloClient from 'apollo-boost';
import ApolloClient from 'apollo-client';
import { WebSocketLink } from 'apollo-link-ws';
import { ApolloLink, split } from 'apollo-link';
import { createHttpLink } from 'apollo-link-http';
import { getMainDefinition } from 'apollo-utilities';
import { InMemoryCache } from 'apollo-cache-inmemory';

// const client = new ApolloClient({
//     uri: 'http://localhost:4000/graphql',
//     request: async (operation) => {
//         const token = localStorage.getItem('token');
//         const refreshToken = localStorage.getItem('refreshToken');
//         if (token && refreshToken) {
//             operation.setContext({
//                 headers: {
//                     'x-token': token,
//                     'x-refresh-token': refreshToken,
//                 },
//             });
//         }
//     },
//     onError: ({ graphQLErrors, networkError }) => {
//         if (graphQLErrors) {
//             // sendToLoggingService(graphQLErrors);
//         }
//         if (networkError) {
//             // console.log(networkError);
//             // if (networkError.statusCode === 401) logout();
//         }
//     },
// });

const httpLink = createHttpLink({ uri: process.env.REACT_APP_SERVER_HOST });

const wsLink = new WebSocketLink({
    uri: process.env.REACT_APP_SERVER_WS_HOST,
    options: {
        reconnect: true,
        connectionParams: {
            token: localStorage.getItem('token'),
            refreshToken: localStorage.getItem('refreshToken'),
        },
    },
});

const requestMiddlewareLink = new ApolloLink((operation, forward) => {
    const token = localStorage.getItem('token');
    const refreshToken = localStorage.getItem('refreshToken');
    if (token && refreshToken) {
        operation.setContext({
            headers: {
                'x-token': token,
                'x-refresh-token': refreshToken,
            },
        });
    }
    return forward(operation).map((data) => {
        const { response: { headers } } = operation.getContext();
        if (headers) {
            const newToken = headers.get('x-token');
            const newRefreshToken = headers.get('x-refresh-token');
            if (newToken) {
                localStorage.setItem('token', newToken);
            }
            if (newRefreshToken) {
                localStorage.setItem('refreshToken', newRefreshToken);
            }
        }
        return data;
    });
});

export default new ApolloClient({
    link: split(
        ({ query }) => {
            const { kind, operation } = getMainDefinition(query);
            return kind === 'OperationDefinition' && operation === 'subscription';
        },
        wsLink,
        requestMiddlewareLink.concat(httpLink),
    ),
    cache: new InMemoryCache(),
});
