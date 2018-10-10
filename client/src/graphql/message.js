import gql from 'graphql-tag';

export const MESSAGES_QUERY = gql`
    query($channelId: Int!) {
        messages(channelId: $channelId) {
            id
            text
            sender {
                username
            }
            files
            created_at
        }
    }
`;

export const CHANNEL_MESSAGES_SUBSCRIPTION = gql`
    subscription($channelId: Int!) {
        newChannelMessage(channelId: $channelId) {
            id
            text
            sender {
                username
            }
            files
            created_at
        }
    }
`;

export const CREATE_MESSAGE_MUTATION = gql`
    mutation($channelId: Int!, $text: String!) {
        createMessage(channelId: $channelId, text: $text)
    }
`;

export const CREATE_FILE_MESSAGE_MUTATION = gql`
    mutation($channelId: Int!, $files: [File!]) {
        createMessage(channelId: $channelId, files: $files)
    }
`;
