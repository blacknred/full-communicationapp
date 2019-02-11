/* eslint-disable no-undef */
import fetch, {
    setSubscriptionAuth,
    subscribe,
} from './fetcher';
import testData from './tests_data';

const {
    updates: {
        newMessageText,
    },
} = testData;

/*
1 user:
    create text message
    create file message
    update message
    pin message
    unpin message
    delete message
    get messages
*/

describe('message resolvers', async () => {
    beforeAll(() => setSubscriptionAuth(testData.auth[0]));

    beforeEach(() => jest.setTimeout(10000));

    // afterAll(() => setTimeout(() => process.exit(), 1000));

    test('subscription', async () => {
        const s = subscribe(`
            subscription {
                channelMessagesUpdates(channelId: ${testData.channels[1].id}) {
                    id
                    text
                    pinned
                    forwarded
                    announcement
                    sender {
                        username
                        online
                    }
                    files {
                        size
                        name
                        path
                        type
                        thumb
                        description
                    },
                }
            }
        `, {
            next: ({ data }) => {
                // console.log(data);
                testData.messages[2].id = parseInt(data.channelMessagesUpdates.id, 10);
                expect(data).toMatchObject({
                    channelMessagesUpdates: testData.messages[2],
                });
                s.unsubscribe();
            },
            error: e => console.log(e),
        });
    });

    test('create text message', async () => {
        const { data } = await fetch(`
            mutation {
                createMessage(
                    channelId: ${testData.channels[1].id},
                    text: "${testData.messages[2].text}"
                )
            }
        `, testData.auth[0]);

        expect(data).toMatchObject({
            createMessage: true,
        });
    });

    test('create file message', async () => {
        const {
            size,
            name,
            path,
            type,
            thumb,
            description,
        } = testData.messages[3].files[0];
        const { data } = await fetch(`
            mutation {
                createMessage(
                    channelId: ${testData.channels[1].id},
                    text: "${testData.messages[3].text}"
                    files: [
                        {
                            size: ${size}, name: "${name}", path: "${path}",
                            type: "${type}", thumb: "${thumb}",
                            description: "${description}"
                        }
                    ]
                )
            }
        `, testData.auth[0]);

        expect(data).toMatchObject({
            createMessage: true,
        });
    });

    test('update message', async () => {
        const { data } = await fetch(`
            mutation {
                updateMessage(
                    messageId: ${testData.messages[2].id},
                    text: "${newMessageText}"
                )
            }
        `, testData.auth[0]);

        expect(data).toMatchObject({
            updateMessage: true,
        });
    });

    test('pin message', async () => {
        const { data } = await fetch(`
            mutation {
                pinMessage(
                    messageId: ${testData.messages[2].id},
                    adminAccess: ${true},
                    status: ${true}
                )
            }
        `, testData.auth[0]);

        expect(data).toMatchObject({
            pinMessage: true,
        });
    });

    test('unpin message', async () => {
        const { data } = await fetch(`
            mutation {
                pinMessage(
                    messageId: ${testData.messages[2].id},
                    adminAccess: ${true},
                    status: ${false}
                )
            }
        `, testData.auth[0]);

        expect(data).toMatchObject({
            pinMessage: true,
        });
    });

    test('delete message', async () => {
        const { data } = await fetch(`
            mutation {
                deleteMessage(messageId: ${testData.messages[2].id})
            }
        `, testData.auth[0]);

        testData.messages.splice(2, 1);

        expect(data).toMatchObject({
            deleteMessage: true,
        });
    });

    test('get messages', async () => {
        const { data } = await fetch(`
            {
                getMessages(channelId: ${testData.channels[1].id}) {
                    text
                    pinned
                    forwarded
                    announcement
                    sender {
                        username
                        online
                    }
                    files {
                        size
                        name
                        path
                        type
                        thumb
                        description
                    },
                }
            }
        `, testData.auth[0]);

        expect(data).toMatchObject({
            getMessages: testData.messages.reverse(),
        });
    });
});
