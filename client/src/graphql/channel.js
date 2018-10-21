import gql from 'graphql-tag';

export const CREATE_CHANNEL_MUTATION = gql`
    mutation($teamId: Int!, $name: String!, $private: Boolean!, $description: String, $members: [Int!]) {
        createChannel(teamId: $teamId, name: $name, private: $private, description: $description, members: $members) {
            ok
            channel {
                id
                name
                description
                private
                dm
                updatesCount
                participantsCount
            }
            errors {
                path
                message
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
        updateChannel(channelId: $channelId, option: $option, value: $value) {
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

export const STAR_CHANNEL_MUTATION = gql`
    mutation($channelId: Int!) {
        starChannel(channelId: $channelId)
    }
`;

export const UNSTAR_CHANNEL_MUTATION = gql`
    mutation($channelId: Int!) {
        unstarChannel(channelId: $channelId)
    }
`;
