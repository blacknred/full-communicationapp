import gql from 'graphql-tag';

export const ALL_TEAMS_QUERY = gql`
    {
        allTeams {
            id
            name
            owner
            channels {
                id
                name
                public
            }
        }
        inviteTeams {
            id
            name
            owner
            channels {
                id
                name
                public
            }
        }
    }
`;

export const CREATE_TEAM_MUTATION = gql`
    mutation CreateTeam($name: String!) {
        createTeam(name: $name) {
            ok
            team {
                id
            }
            errors {
                path
                message
            }
        }
    }
`;

export const ADD_TEAM_MEMBER_MUTATION = gql`
    mutation AddTeamMember($email: String!, $teamId: Int!) {
        addTeamMember(email: $email, teamId: $teamId) {
            ok
            errors {
                path
                message
            }
        }
    }
`;
