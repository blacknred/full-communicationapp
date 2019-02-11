import ws from 'ws';
import fetch from 'node-fetch';
import gql from 'graphql-tag';
import { HttpLink } from 'apollo-link-http';
import { WebSocketLink } from 'apollo-link-ws';
import { execute, makePromise } from 'apollo-link';
import { SubscriptionClient } from 'subscriptions-transport-ws';

import testData from './tests_data';

const {
    serverUrl,
    serverWsUrl,
} = testData;

const link = new HttpLink({
    uri: serverUrl,
    fetch,
});
let wsLink;

const setSubscriptionAuth = ({ token, refreshToken }) => {
    const wsClient = new SubscriptionClient(serverWsUrl, {
        reconnect: true,
        lazy: true,
        connectionParams: {
            token,
            refreshToken,
        },
    }, ws);
    wsLink = new WebSocketLink(wsClient);
};

const doQuery = (query, headers) => {
    const operation = {
        query: gql`${query}`,
    };
    if (headers) {
        operation.context = {
            headers: {
                'x-token': headers.token,
                'x-refresh-token': headers.refreshToken,
            },
        };
    }

    return makePromise(execute(link, operation));
};

const subscribe = (query, handlers) => {
    const operation = {
        query: gql`${query}`,
        context: {
            headers: {
                'x-token': testData.auth[0].token,
                'x-refresh-token': testData.auth[0].refreshToken,
            },
        },
    };

    return execute(wsLink, operation).subscribe(handlers);

    // return execute(link, operation).subscribe(handlers);
};

// const subscriptionPromise = new Promise((resolve, reject) => execute(wsLink, {
//     query: `
//         subscription {
//             channelMessagesUpdates(channelId: ${testData.channels[1].id}) {
//                 id
//                 text
//                 pinned
//                 forwarded
//                 announcement
//                 sender {
//                     username
//                     online
//                 }
//                 files {
//                     size
//                     name
//                     path
//                     type
//                     thumb
//                     description
//                 },
//             }
//         }
//     `,
// }).subscribe({
//     next: (data) => {
//         resolve(data);
//         // process.exit(0);
//     },
//     error: (e) => {
//         console.log(e);
//         reject(e);
//     },
// }));

export default doQuery;
export {
    subscribe,
    setSubscriptionAuth,
};
