import React from 'react';
import { render } from 'react-dom';
import { ApolloProvider } from 'react-apollo';

import Routes from './routes';
import client from './apolloClient';
import registerServiceWorker from './registerServiceWorker';

const App = () => (
    <ApolloProvider client={client}>
        <Routes />
    </ApolloProvider>
);

render(<App />, document.getElementById('root'));
registerServiceWorker();
