import axios from 'axios';
import { XMLHttpRequest } from 'xmlhttprequest';
import data from './tests_data';

const { serverUrl, team, directMessage, users } = data;

global.XMLHttpRequest = XMLHttpRequest;

describe('direct message resolvers', async () => {
    test('create direct message', async () => {
        const res = await axios.post(
            serverUrl,
            {
                query: `
                    mutation {
                        createDirectMessage(teamId: ${team.id}, receiverId: ${users[1].id}, text: ${directMessage.text})
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

    test('get direct messages', async () => {
        const { data: { messages } } = await axios.post(
            serverUrl,
            {
                query: `
                    messages(teamId: ${team.id}, otherUserId: ${users[1].id}) {
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
        expect(messages).toMatchObject({
            messages: [directMessage],
        });
    });
});
