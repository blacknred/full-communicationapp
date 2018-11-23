import gql from 'graphql-tag';

export const GET_CHANNEL_MEMBERS_QUERY = gql`
    query GetChannelMembers($channelId: Int!) {
        getChannelMembers(channelId: $channelId) {
            id
            username
            online
        }
    }
`;

export const CREATE_CHANNEL_MUTATION = gql`
    mutation($teamId: Int!, $name: String!, $private: Boolean!, $description: String, $members: [Int!]) {
        createChannel(teamId: $teamId, name: $name, private: $private, description: $description, members: $members) {
            ok
            channel {
                id
                dm
                name
                description
                private
                starred
                updatesCount
                membersCount
            }
            errors {
                path
                message
            }
        }
    }
`;

export const CREATE_DM_CHANNEL_MUTATION = gql`
    mutation($teamId: Int!, $members: [Int!]!) {
        createDMChannel(teamId: $teamId, members: $members) {
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
`;

export const UPDATE_CHANNEL_MUTATION = gql`
    mutation UpdateChannel($channelId: Int!, $name: String!, $private: Boolean!, $description: String, $members: [Int!]) {
        updateChannel(channelId: $channelId, name: $name, private: $private, description: $description, members: $members) {
            ok
            channel {
                name
                description
                private
            }
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
