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
        newChannelMessage(channelId: Int!): Message!
    }

    type Query {
        messages(channelId: Int!): [Message!]!
    }

    type Mutation {
        createMessage(channelId: Int!, text: String, files: [File!]): Boolean!
    }
`;
