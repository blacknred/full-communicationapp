import fetch from './fetcher';
import testData from './tests_data';

const {
    password,
    updates: {
        newPassword,
        newUsername,
    },
} = testData;

/*
register 3 users
login 3 users
user 3
    update
    receive own data
    update password
    login with new password
    delete himself
*/

describe('user resolvers', () => {
    test('register', async () => {
        const { data } = await testData.users.reduce((prom, user) => prom
            .then(() => fetch(`
                mutation {
                    register(
                        username: "${user.username}",
                        email: "${user.email}",
                        password: "${password}"
                    ) {
                        ok
                        errors {
                            path
                            message
                        }
                        user {
                            id
                            username
                            email
                        }
                    }
                }
            `)), Promise.resolve());

        expect(data).toMatchObject({
            register: {
                ok: true,
                errors: null,
                user: testData.users[2],
            },
        });
    });

    test('login', async () => {
        const data = await Promise.all(
            testData.users.map(({ email }) => fetch(`
                mutation {
                    login(email: "${email}", password: "${password}") {
                        ok
                        errors {
                            message
                            path
                        }
                        token
                        refreshToken
                    }
                }
            `)),
        );

        testData.auth = data.map((t) => {
            const { data: { login: { token, refreshToken } } } = t;
            return {
                token,
                refreshToken,
            };
        });

        expect(data[0].data).toMatchObject({
            login: {
                ok: true,
                errors: null,
                ...testData.auth[0],
            },
        });
    });

    test('update user', async () => {
        const { data } = await fetch(`
            mutation {
                updateUser(option: username, value: "${newUsername}") {
                    ok
                    errors {
                        path
                        message
                    }
                }
            }
        `, testData.auth[2]);

        testData.users[2].username = newUsername;

        expect(data).toMatchObject({
            updateUser: {
                ok: true,
                errors: null,
            },
        });
    });

    test('get user data', async () => {
        const { data } = await fetch(`
            {
                getUser {
                    id
                    username
                    email
                    online
                }
            }
        `, testData.auth[2]);

        expect(data).toMatchObject({
            getUser: {
                ...testData.users[2],
                online: true,
            },
        });
    });

    test('update user password', async () => {
        const { data } = await fetch(`
            mutation {
                updateUserPassword(
                    oldPassword: "${password}",
                    password: "${newPassword}"
                ) {
                    ok
                    errors {
                        path
                        message
                    }
                }
            }
        `, testData.auth[2]);

        expect(data).toMatchObject({
            updateUserPassword: {
                ok: true,
                errors: null,
            },
        });
    });

    test('login with new password', async () => {
        const { data } = await fetch(`
            mutation {
                login(
                    email: "${testData.users[2].email}",
                    password: "${newPassword}") {
                    token
                    refreshToken
                }
            }
        `);

        testData.auth[2] = data.login;

        expect(data).toMatchObject({
            login: testData.auth[2],
        });
    });

    test('delete user', async () => {
        const { data } = await fetch(`
            mutation {
                deleteUser
            }
        `, testData.auth[2]);

        testData.users.length = 2;

        expect(data).toMatchObject({
            deleteUser: true,
        });
    });
});
