import gql from 'graphql-tag';

export const MESSAGES_QUERY = gql`
    query($channelId: Int!) {
        messages(channelId: $channelId) {
            id
            text
            user {
                username
            }
            created_at
        }
    }
`;

export const NEW_CHANNEL_MESSAGE_SUBSCRIPTION = gql`
    subscription($channelId: Int!) {
        newChannelMessage(channelId: $channelId) {
            id
            text
            user {
                username
            }
            created_at
        }
    }
`;

export const CREATE_MESSAGE_MUTATION = gql`
    mutation($channelId: Int!, $text: String!) {
        createMessage(channelId: $channelId, text: $text)
    }
`;

export const CREATE_DIRECT_MESSAGE_MUTATION = gql`
    mutation($channelId: Int!, $text: String!) {
        createMessage(channelId: $channelId, text: $text)
    }
`;
