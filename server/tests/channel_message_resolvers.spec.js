import axios from 'axios';
import { XMLHttpRequest } from 'xmlhttprequest';
import data from './tests_data';

const { serverUrl, channel, channelMessage } = data;

global.XMLHttpRequest = XMLHttpRequest;

describe('channel message resolvers', async () => {
    test('create channel message', async () => {
        const res = await axios.post(
            serverUrl,
            {
                query: `
                    mutation {
                        createChannelMessage(channelId: ${channel.id}, text: ${channelMessage.text})
                    }
                `,
            },
            {
                headers: {
                    'x-token': data.token,
                    'x-refresh-token': data.refreshtoken,
                },
            },
        );
        expect(res.data).toMatchObject({
            [res.data]: true,
        });
    });

    test('get channel messages', async () => {
        const { data: { channelMessages } } = await axios.post(
            serverUrl,
            {
                query: `
                    channelMessages(channelId: ${channel.id}) {
                        id
                        text
                        sender {
                            username
                        }
                    }
                `,
            },
            {
                headers: {
                    'x-token': data.token,
                    'x-refresh-token': data.refreshtoken,
                },
            },
        );
        expect(channelMessages).toMatchObject({
            channelMessages: [channelMessage],
        });
    });
});
