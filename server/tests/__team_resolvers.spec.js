import axios from 'axios';
import { XMLHttpRequest } from 'xmlhttprequest';
import data from './tests_data';

const { serverUrl, team, users } = data;

global.XMLHttpRequest = XMLHttpRequest;

describe('team resolvers', async () => {
    test('create team', async () => {
        const { data: { createTeam } } = await axios.post(
            serverUrl,
            {
                query: `
                    mutation {
                        createTeam(name: ${team.name}) {
                            ok
                            team {
                                id
                                name
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
        expect(createTeam).toMatchObject({
            createTeam: {
                ok: true,
                errors: null,
                team,
            },
        });
    });

    test('add team member', async () => {
        const { data: { addTeamMember } } = await axios.post(
            serverUrl,
            {
                query: `
                    mutation {
                        addTeamMember(email: ${users[1].email}, teamId: ${team.id}) {
                            ok
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
        expect(addTeamMember).toMatchObject({
            addTeamMember: {
                ok: true,
                errors: null,
            },
        });
    });

    test('get team members', async () => {
        const { data: { teamMembers } } = await axios.post(
            serverUrl,
            {
                query: `
                    teamMembers(teamId: ${team.id}) {
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
                    'x-refresh-token': data.refreshtoken,
                },
            },
        );
        expect(teamMembers).toMatchObject({
            teamMembers: [
                {
                    ...users[0],
                    online: true,
                },
                {
                    ...users[1],
                },
            ],
        });
    });
});
