import gql from 'graphql-tag';

export const ME_QUERY = gql`
    {
        me {
            id
            username
            teams {
                id
                name
                admin {
                    id
                    username
                }
                channels {
                    id
                    name
                    public
                }
                directMessageMembers {
                    id
                    username
                }
            }
        }
    }
`;

export const TEAM_MEMBERS_QUERY = gql`
    query TeamMembers($teamId: Int!) {
        teamMembers(teamId: $teamId) {
            id
            username
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
