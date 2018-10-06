export default {
    serverUrl: 'http://localhost:4000/graphql',
    token: null,
    refreshtoken: null,
    password: 'password7',
    users: [
        {
            id: 1,
            username: 'alisson',
            email: 'alisson@test.com',
            online: false,
        },
        {
            id: 2,
            username: 'kepa',
            email: 'kepa@test.com',
            online: false,
        },
    ],
    team: {
        id: 1,
        name: 'first team',
    },
    channel: {
        id: 1,
        name: 'first channel',
        public: true,
    },
    channelMessage: {
        id: 1,
        text: 'channel text',
        sender: {
            username: 'alisson',
        },
    },
    directMessage: {
        id: 1,
        text: 'direct text',
        sender: {
            username: 'alisson',
        },
    },
};
