export default `
    type Message {
        id: Int!
        text: String!
        user: User!
        channel: Channel!
        created_at: String!
    }

    type Subscription {
        newChannelMessage(channelId: Int!): Message!
    }

    type Query {
        messages(channelId: Int!): [Message!]!
    }

    type Mutation {
        createChannelMessage(channelId: Int!, text: String!): Boolean!
    }
`;
