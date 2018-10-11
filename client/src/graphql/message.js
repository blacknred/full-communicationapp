import gql from 'graphql-tag';

export const GET_MESSAGES_QUERY = gql`
    query($channelId: Int!) {
        getMessages(channelId: $channelId) {
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
    mutation($channelId: Int!, $files: [File!], $forwarded: Boolean=false) {
        createMessage(channelId: $channelId, files: $files, forwarded: $forwarded)
    }
`;

export const UPDATE_MESSAGE_MUTATION = gql`
    mutation($messageId: Int!, newText: String, $newFiles: [File!]) {
        editMessage(messageId: $messageId, newText: $newText, newFiles: $newFiles)
    }
`;

export const DELETE_MESSAGE_MUTATION = gql`
    mutation($messageId: Int!, $adminAccess: Boolean) {
        deleteMessage(messageId: $messageId, adminAccess: $adminAccess)
    }
`;

export const CHANNEL_MESSAGES_SUBSCRIPTION = gql`
    subscription($channelId: Int!) {
        channelMessagesUpdated(channelId: $channelId) {
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
