import gql from 'graphql-tag';

export const ALL_TEAMS_QUERY = gql`
    {
        allTeams {
            id
            name,
            channels {
                id,
                name
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
