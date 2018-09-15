import React from 'react';
import { render } from 'react-dom';
import { ApolloProvider } from 'react-apollo';

// import ApolloClient from 'apollo-boost';
import { ApolloClient } from 'apollo-client';
import { createHttpLink } from 'apollo-link-http';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { ApolloLink } from 'apollo-link';

import Routes from './routes';
import registerServiceWorker from './registerServiceWorker';

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
    return forward(operation)
        .map((data) => {
            const context = operation.getContext();
            const { response: { headers } } = context;
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

const client = new ApolloClient({
    link: requestMiddlewareLink.concat(httpLink),
    cache: new InMemoryCache(),
});

const App = () => (
    <ApolloProvider client={client}>
        <Routes />
    </ApolloProvider>
);

render(<App />, document.getElementById('root'));
registerServiceWorker();
