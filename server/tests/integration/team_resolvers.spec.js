import * as qs from 'query-string';

import fetch from './fetcher';
import testData from './tests_data';

const {
    users,
    channels,
    password,
    teamAccess,
    updates: {
        newTeamName,
        newTeamDescription,
    },
} = testData;

/*
1 user:
    create 2 teams
    add user 2 to team 1
    create team 2 acccess link
    update team 2
2 user:
    login with team 2 link
    get team 2
    leave team 2
1 user
    get teams,
    delete team 2
*/

describe('team resolvers', async () => {
    test('create team', async () => {
        const { data } = await testData.teams.reduce((prom, team) => prom
            .then(() => fetch(`
                mutation {
                    createTeam(
                        name: "${team.name}",
                        description: "${team.description}"
                    ) {
                        ok
                        team {
                            id
                            name
                            description
                        }
                        errors {
                            path
                            message
                        }
                    }
                }
            `, testData.auth[0])), Promise.resolve());

        expect(data).toMatchObject({
            createTeam: {
                ok: true,
                errors: null,
                team: testData.teams[1],
            },
        });
    });

    test('add team member', async () => {
        const { data } = await fetch(`
            mutation {
                addTeamMember(
                    teamId: ${testData.teams[0].id},
                    email: "${users[1].email}"
                ) {
                    ok
                    errors {
                        path
                        message
                    }
                    status
                }
            }
        `, testData.auth[0]);

        expect(data).toMatchObject({
            addTeamMember: {
                ok: true,
                errors: null,
                status: teamAccess.status,
            },
        });
    });

    test('create team access link', async () => {
        const { data } = await fetch(`
            mutation {
                createTeamAccessLink(
                    teamId: ${testData.teams[1].id},
                    hours: ${teamAccess.hours}
                )
            }
        `, testData.auth[0]);

        teamAccess.link = data.createTeamAccessLink;

        expect(data).toMatchObject({
            createTeamAccessLink: teamAccess.link,
        });
    });

    test('update team', async () => {
        const { data } = await fetch(`
            mutation {
                updateTeam(
                    teamId: ${testData.teams[1].id},
                    name: "${newTeamName}",
                    description: "${newTeamDescription}"
                ) {
                    ok
                    team {
                        id
                        name
                        description
                    }
                    errors {
                        path
                        message
                    }
                }
            }
        `, testData.auth[0]);

        testData.teams[1].name = newTeamName;
        testData.teams[1].description = newTeamDescription;

        expect(data).toMatchObject({
            updateTeam: {
                ok: true,
                errors: null,
                team: testData.teams[1],
            },
        });
    });

    test('login with team access link', async () => {
        const { query: { token } } = qs.parseUrl(teamAccess.link);
        const { data } = await fetch(`
            mutation {
                login(
                    email: "${users[1].email}",
                    password: "${password}",
                    teamToken: "${token}"
                ) {
                    ok
                    token
                    refreshToken
                    errors {
                        path
                        message
                    }
                }
            }
        `, testData.auth[1]);

        testData.auth[1].token = data.login.token;
        testData.auth[1].refreshToken = data.login.refreshToken;

        expect(data).toMatchObject({
            login: {
                ok: true,
                errors: null,
                ...testData.auth[1],
            },
        });
    });

    test('get team', async () => {
        const { data } = await fetch(`
            {
                getTeam(teamId: ${testData.teams[1].id}) {
                    id
                    name
                    description
                    updatesCount
                    membersCount
                    admin {
                        id
                        email
                        username
                        online
                    }
                    members {
                        id
                        email
                        username
                    }
                    channels {
                        name
                        description
                        private
                        dm
                        starred
                        participantsCount
                    }
                }
            }
        `, testData.auth[1]);

        expect(data).toMatchObject({
            getTeam: {
                ...testData.teams[1],
                updatesCount: 0,
                membersCount: 2, // ?2
                admin: {
                    ...testData.users[0],
                    online: true,
                },
                members: testData.users,
                channels: [
                    {
                        ...channels[0],
                        starred: false,
                        participantsCount: 1,
                    },
                ],
            },
        });
    });

    test('leave team', async () => {
        const { data } = await fetch(`
            mutation {
                leaveTeam(teamId: ${testData.teams[1].id})
            }
        `, testData.auth[1]);

        expect(data).toMatchObject({
            leaveTeam: true,
        });
    });

    test('get teams', async () => {
        const { data } = await fetch(`
            {
                getTeams {
                    id
                    name
                    description
                    updatesCount
                    membersCount
                    admin {
                        id
                        email
                        username
                        online
                    }
                    members {
                        id
                        email
                        username
                    }
                    channels {
                        name
                        description
                        private
                        dm
                        starred
                        participantsCount
                    }
                }
            }
        `, testData.auth[0]);

        expect(data).toMatchObject({
            getTeams: testData.teams.map(team => ({
                ...team,
                updatesCount: 0,
                membersCount: 2,
                admin: {
                    ...testData.users[0],
                    online: true,
                },
                members: testData.users,
                channels: [
                    {
                        ...channels[0],
                        starred: false,
                        participantsCount: 1,
                    },
                ],
            })),
        });
    });

    test('delete team', async () => {
        const { data } = await fetch(`
            mutation {
                deleteTeam(teamId: ${testData.teams[1].id})
            }
        `, testData.auth[0]);

        testData.teams.length = 1;

        expect(data).toMatchObject({
            deleteTeam: true,
        });
    });
});
