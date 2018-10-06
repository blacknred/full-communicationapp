import axios from 'axios';
import { XMLHttpRequest } from 'xmlhttprequest';
import data from './tests_data';

const { serverUrl, password, users } = data;

global.XMLHttpRequest = XMLHttpRequest;

describe('user resolvers', () => {
    test('register', async () => {
        const [{ data: { register } }] = Promise.all([
            await axios.post(serverUrl, {
                query: `
                    mutation {
                        register(username: ${users[0].username}, email: ${users[0].email}, password: ${password}) {
                            ok
                            errors {
                                path
                                message
                            }
                            user {
                                id
                                username
                                email
                                online
                            }
                        }
                    }
                `,
            }),
            await axios.post(serverUrl, {
                query: `
                    mutation {
                        register(username: ${users[1].username}, email: ${users[1].email}, password: ${password}) {
                            ok
                            errors {
                                path
                                message
                            }
                        }
                    }
                `,
            }),
        ]);

        expect(register).toMatchObject({
            register: {
                ok: true,
                errors: null,
                user: users[0],
            },
        });
    });

    test('login', async () => {
        const { data: { login } } = await axios.post(serverUrl, {
            query: `
                mutation {
                    login(email: ${users[0].email}, password: ${password}) {
                        ok
                        token
                        refreshToken
                        errors {
                            path
                            message
                        }
                    }
                }
            `,
        });
        data.token = login.token;
        data.refreshToken = login.refreshToken;
        expect(login).toMatchObject({
            login: {
                ok: true,
                token: data.token,
                refreshToken: data.refreshToken,
                errors: null,
            },
        });
    });

    test('get user data', async () => {
        const { data: { getUser } } = await axios.post(
            serverUrl,
            {
                query: `
                    getUser(userId: ${users[1].id}) {
                        id
                        username
                        email
                        online
                    }
                `,
            },
            {
                headers: {
                    'x-token': data.token,
                    'x-refresh-token': data.refreshToken,
                },
            },
        );
        expect(getUser).toMatchObject({
            getUser: users[1],
        });
    });

    test('get mine data', async () => {
        const { data: { me } } = await axios.post(
            serverUrl,
            {
                query: `
                    me {
                        id
                        username
                        email
                        online
                        teams {
                            id
                            name
                            admin {
                                id
                                username
                                online
                            }
                            channels {
                                id
                                name
                                public
                            }
                            directMessageMembers {
                                id
                                username
                                online
                            }
                        }
                    }
                `,
            },
            {
                headers: {
                    'x-token': data.token,
                    'x-refresh-token': data.refreshToken,
                },
            },
        );
        expect(me).toMatchObject({
            me: {
                ...users[0],
                online: true,
                teams: [],
            },
        });
    });
});
