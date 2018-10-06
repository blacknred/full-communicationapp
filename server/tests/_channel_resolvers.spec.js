import axios from 'axios';
import { XMLHttpRequest } from 'xmlhttprequest';
import data from './tests_data';

const { serverUrl, team, channel } = data;

global.XMLHttpRequest = XMLHttpRequest;

describe('channel resolvers', async () => {
    test('create channel', async () => {
        const { data: { createChannel } } = await axios.post(
            serverUrl,
            {
                query: `
                    mutation {
                        createChannel(teamId: ${team.id}, name: ${channel.name}, public: ${channel.public}) {
                            ok
                            channel {
                                id
                                name
                                public
                            }
                            errors {
                                path
                                message
                            }
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
        expect(createChannel).toMatchObject({
            createChannel: {
                ok: true,
                errors: null,
                channel,
            },
        });
    });
});
