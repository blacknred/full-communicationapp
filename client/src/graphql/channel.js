import gql from 'graphql-tag';

export const CREATE_CHANNEL_MUTATION = gql`
    mutation($teamId: Int!, $name: String!, $public: Boolean!) {
        createChannel(teamId: $teamId, name: $name, public: $public) {
            ok
            channel {
                id
                name
            }
            errors
        }
    }
`;