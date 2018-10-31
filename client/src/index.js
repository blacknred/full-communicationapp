import React from 'react';
import { render } from 'react-dom';
import { Provider } from 'mobx-react';
import { ApolloProvider } from 'react-apollo';

import Routes from './routes';
import AppStore from './appStore';
import client from './apolloClient';
import registerServiceWorker from './registerServiceWorker';

const appStore = new AppStore();

const App = () => (
    <ApolloProvider client={client}>
        <Provider store={appStore}>
            <Routes />
        </Provider>
    </ApolloProvider>
);

render(<App />, document.getElementById('root'));
registerServiceWorker();
