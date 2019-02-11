import fetch from './fetcher';
import testData from './tests_data';

const {
    updates: {
        newChannelName,
        newChannelDescription,
    },
} = testData;

/*
1 user:
    create public channel 2
    create private channel 3
    create dm channel 4
    update channel 2
    get channel 2
    star channel 2
    unstar channel 2
    delete channel 2
*/

describe('channel resolvers', async () => {
    test('create public channel', async () => {
        const { data } = await fetch(`
            mutation {
                createChannel(
                    teamId: ${testData.teams[0].id},
                    name: "${testData.channels[1].name}",
                    description: "${testData.channels[1].description}"
                ) {
                    ok
                    channel {
                        id
                        name
                        private
                        description
                        dm
                    }
                    errors {
                        path
                        message
                    }
                }
            }
        `, testData.auth[0]);

        testData.channels[1].id = parseInt(data.createChannel.channel.id, 10);

        expect(data).toMatchObject({
            createChannel: {
                ok: true,
                errors: null,
                channel: testData.channels[1],
            },
        });
    });

    test('create private channel', async () => {
        const members = testData.users.map(u => u.id);
        const { data } = await fetch(`
            mutation {
                createChannel(
                    teamId: ${testData.teams[0].id},
                    name: "${testData.channels[2].name}",
                    description: "${testData.channels[2].description}",
                    private: ${true},
                    members: [${members}]
                ) {
                    ok
                    channel {
                        id
                        name
                        private
                        description
                        dm
                    }
                    errors {
                        path
                        message
                    }
                }
            }
        `, testData.auth[0]);

        testData.channels[2].id = parseInt(data.createChannel.channel.id, 10);

        expect(data).toMatchObject({
            createChannel: {
                ok: true,
                errors: null,
                channel: testData.channels[2],
            },
        });
    });

    test('create dm channel', async () => {
        const members = testData.users.map(u => u.id);
        const { data } = await fetch(`
            mutation {
                createDMChannel(
                    teamId: ${testData.teams[0].id},
                    members: [${members}]
                ) {
                    id
                    name
                    private
                    description
                    dm
                }
            }
        `, testData.auth[0]);

        testData.channels[3] = {
            ...data.createDMChannel,
            id: parseInt(data.createDMChannel.id, 10),
        };

        expect(data).toMatchObject({
            createDMChannel: testData.channels[3],
        });
    });

    test('update channel', async () => {
        const members = testData.users.map(u => u.id);
        const { data } = await fetch(`
            mutation {
                updateChannel(
                    channelId: ${testData.channels[1].id},
                    name: "${newChannelName}",
                    description: "${newChannelDescription}",
                    private: ${true},
                    members: [${members}]
                ) {
                    ok
                    channel {
                        id
                        name
                        private
                        description
                        dm
                    }
                    errors {
                        path
                        message
                    }
                }
            }
        `, testData.auth[0]);

        testData.channels[1] = {
            ...testData.channels[1],
            name: newChannelName,
            description: newChannelDescription,
            private: true,
        };

        expect(data).toMatchObject({
            updateChannel: {
                ok: true,
                errors: null,
                channel: testData.channels[1],
            },
        });
    });

    test('get channel', async () => {
        const { data } = await fetch(`
            {
                getChannel(channelId: ${testData.channels[1].id}) {
                    id
                    name
                    private
                    dm
                    description
                    updatesCount
                    participantsCount
                    filesCount
                    messagesCount
                    participants {
                        id
                        email
                        username
                    }
                }
            }
        `, testData.auth[0]);

        expect(data).toMatchObject({
            getChannel: {
                ...testData.channels[1],
                updatesCount: 0,
                filesCount: 0,
                messagesCount: 2,
                participantsCount: 2, // ?2
                participants: testData.users,
            },
        });
    });

    test('star channel', async () => {
        const { data } = await fetch(`
            mutation {
                starChannel(channelId: ${testData.channels[1].id})
            }
        `, testData.auth[0]);

        expect(data).toMatchObject({
            starChannel: true,
        });
    });

    test('unstar channel', async () => {
        const { data } = await fetch(`
            mutation {
                unstarChannel(channelId: ${testData.channels[1].id})
            }
        `, testData.auth[0]);

        expect(data).toMatchObject({
            unstarChannel: true,
        });
    });

    test('delete channel', async () => {
        const { data } = await fetch(`
            mutation {
                deleteChannel(channelId: ${testData.channels[2].id})
            }
        `, testData.auth[0]);

        testData.channels.length = 2;

        expect(data).toMatchObject({
            deleteChannel: true,
        });
    });
});
