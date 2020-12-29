export default {
    serverUrl: 'http://localhost:4001/graphql',
    serverWsUrl: 'ws://localhost:4001/subscriptions',
    password: 'password7',
    auth: [],
    updates: {
        newPassword: 'password8',
        newUsername: 'oblak',
        newTeamName: 'New team name',
        newTeamDescription: 'New team description',
        newChannelName: 'New channel name',
        newChannelDescription: 'New channel description',
        newMessageText: 'new message text',
    },
    teamAccess: {
        hours: 1,
        link: null,
        status: 'New member has been added',
    },
    users: [
        {
            id: 1,
            username: 'alisson',
            email: 'alisson@test.com',
        },
        {
            id: 2,
            username: 'arrizabalaga',
            email: 'kepa@test.com',
        },
        {
            id: 3,
            username: 'ederson',
            email: 'ederson@test.com',
        },
    ],
    teams: [
        {
            id: 1,
            name: 'team1',
            description: 'first team',
        },
        {
            id: 2,
            name: 'team2',
            description: 'second team',
        },
    ],
    channels: [
        {
            name: 'general',
            description: null,
            private: false,
            dm: false,
        },
        {
            name: 'work',
            description: 'public channel',
            private: false,
            dm: false,
        },
        {
            name: 'news',
            description: 'private channel',
            private: true,
            dm: false,
        },
    ],
    messages: [
        {
            text: 'Channel has been created!',
            announcement: true,
            forwarded: false,
            pinned: false,
            sender: {
                username: 'alisson',
                online: true,
            },
            files: [],
        },
        {
            text: 'Access restricted to 2 members',
            announcement: true,
            forwarded: false,
            pinned: false,
            sender: {
                username: 'alisson',
                online: true,
            },
            files: [],
        },
        {
            text: 'message text',
            announcement: false,
            forwarded: false,
            pinned: false,
            sender: {
                username: 'alisson',
                online: true,
            },
            files: [],
        },
        {
            text: 'file message text',
            announcement: false,
            forwarded: false,
            pinned: false,
            sender: {
                username: 'alisson',
                online: true,
            },
            files: [
                {
                    size: 800000,
                    name: 'test_file1',
                    path: 'https://storage.com/test_file1.jpg',
                    type: 'jpg',
                    thumb: 'https://storage.com/test_file1_thumb.jpg',
                    description: '',
                },
            ],
        },
    ],
};
