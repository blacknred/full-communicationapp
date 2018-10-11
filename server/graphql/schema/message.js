export default `
    type Message {
        id: Int!
        text: String
        sender: User!
        channel: Channel!
        created_at: String!
        files: [File!]
    }

    type Subscription {
        channelMessagesUpdated(channelId: Int!): Message!
    }

    type Query {
        getMessages(channelId: Int!): [Message!]!
    }

    type Mutation {
        createMessage(channelId: Int!, text: String, files: [File!], forwarded: Boolean=false): Boolean!
        updateMessage(messageId: Int!, newText: String, newFiles: [File!]): Boolean!
        deleteMessage(messageId: Int!, adminAccess: Boolean=false): Boolean!
    }
`;
