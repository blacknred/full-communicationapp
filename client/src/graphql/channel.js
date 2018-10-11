import gql from 'graphql-tag';

export const CREATE_CHANNEL_MUTATION = gql`
    mutation($teamId: Int!, $name: String!, $private: Boolean!, $members: [Int!]) {
        createChannel(teamId: $teamId, name: $name, private: $private, members: $members) {
            ok
            errors {
                path
                message
            }
            channel {
                id
                name
                private
            }
        }
    }
`;

export const GET_OR_CREATE_CHANNEL_MUTATION = gql`
    mutation($teamId: Int!, $members: [Int!]!) {
        getOrCreateChannel(teamId: $teamId, members: $members) {
            id
            name
        }
    }
`;

export const UPDATE_CHANNEL_MUTATION = gql`
    mutation UpdateChannel($channelId: Int!, $option: String!, $value: String!) {
        updateChannel(channelId: channelId!, option: $option, value: $value) {
            ok
            errors {
                path
                message
            }
        }
    }
`;

export const DELETE_CHANNEL_MUTATION = gql`
    mutation DeleteChannel($channelId: Int!) {
        deleteChannel(channelId: $channelId)
    }
`;
