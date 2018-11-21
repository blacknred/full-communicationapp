import gql from 'graphql-tag';

export const GET_TEAMS_QUERY = gql`
    {
        getTeams {
            id
            name
            description
            updatesCount
            membersCount
            admin {
                id
                username
                online
            }
            channels {
                id
                dm
                name
                description
                private
                starred
                updatesCount
                membersCount
            }
        }
    }
`;

export const GET_TEAM_MEMBERS_QUERY = gql`
    query GetTeamMembers($teamId: Int!) {
        getTeamMembers(teamId: $teamId) {
            id
            username
            online
        }
    }
`;

export const CREATE_TEAM_MUTATION = gql`
    mutation CreateTeam($name: String!, $description: String) {
        createTeam(name: $name, description: $description) {
            ok
            errors {
                path
                message
            }
            team {
                id
                name
                description
                updatesCount
                membersCount
                admin {
                    id
                    username
                    online
                }
                channels {
                    id
                    dm
                    name
                    description
                    private
                    starred
                    updatesCount
                    membersCount
                }
            }
        }
    }
`;

export const UPDATE_TEAM_MUTATION = gql`
    mutation UpdateTeam($teamId: Int!, $option: String!, $value: String!) {
        updateTeam(teamId: $teamId, option: $option, value: $value) {
            ok
            errors {
                path
                message
            }
        }
    }
`;

export const DELETE_TEAM_MUTATION = gql`
    mutation DeleteTeam($teamId: Int!) {
        deleteTeam(teamId: $teamId) {
            ok
            errors {
                path
                message
            }
        }
    }
`;

export const ADD_TEAM_MEMBER_MUTATION = gql`
    mutation AddTeamMember($teamId: Int!, $email: String!) {
        addTeamMember(teamId: $teamId, email: $email) {
            ok
            errors {
                path
                message
            }
            status
        }
    }
`;
