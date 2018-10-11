export default `
    type Channel {
        id: Int!
        name: String!
        private: Boolean!
        messages: [Message!]!
        users: [User!]!
        dm: Boolean!
    }

    type ChannelResponse {
        ok: Boolean!
        errors: [Error!]
        channel: Channel
    }

    type DMChannelResponse {
        ok: Boolean!
        errors: [Error!]
        id: Int!
        name: String!
    }

    type Mutation {
        createChannel(teamId: Int!, name: String!, private: Boolean=false, members: [Int!]=[]): ChannelResponse!
        getOrCreateChannel(teamId: Int!, members: [Int!]!): DMChannelResponse!
        updateChannel(channelId: Int!, option: String!, value: String!): ChannelResponse!
        deleteChannel(channelId: Int!): Boolean!
    }
`;
