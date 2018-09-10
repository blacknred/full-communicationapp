import React from 'react';
import { render } from 'react-dom';
import ApolloClient from 'apollo-boost';
import { ApolloProvider } from 'react-apollo';

import Routes from './routes';
import registerServiceWorker from './registerServiceWorker';

const client = new ApolloClient({
    uri: 'http://localhost:4000/graphql',
    request: async (operation) => {
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
    },
    onError: ({ graphQLErrors, networkError }) => {
        if (graphQLErrors) {
            // sendToLoggingService(graphQLErrors);
        }
        if (networkError) {
            // console.log(networkError);
            // if (networkError.statusCode === 401) logout();
        }
    },
    // const token = headers.get('x-token');
    // const refreshToken = headers.get('x-refresh-token');
    // if (token) {
    //     localStorage.setItem('token', token);
    // }
    // if (refreshToken) {
    //     localStorage.setItem('refreshToken', refreshToken);
    // }
});

const App = () => (
    <ApolloProvider client={client}>
        <Routes />
    </ApolloProvider>
);

render(<App />, document.getElementById('root'));
registerServiceWorker();
