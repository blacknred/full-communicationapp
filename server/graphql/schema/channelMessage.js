export default `
    type ChannelMessage {
        id: Int!
        text: String
        sender: User!
        channel: Channel!
        created_at: String!
        files: [File!]
    }

    type Subscription {
        newChannelMessage(channelId: Int!): ChannelMessage!
    }

    type Query {
        channelMessages(channelId: Int!): [ChannelMessage!]!
    }

    type Mutation {
        createChannelMessage(channelId: Int!, text: String, files: [File!]): Boolean!
    }
`;
