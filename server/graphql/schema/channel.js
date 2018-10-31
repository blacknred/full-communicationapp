export default `
    enum ChannelUpdateOptions {
        name
        description
    }

    type Channel {
        id: Int!
        name: String!
        description: String
        private: Boolean!
        dm: Boolean!
        users: [User!]!
        updatesCount: Int!
        participantsCount: Int!
    }

    type ChannelResponse {
        ok: Boolean!
        channel: Channel
        errors: [Error!]
    }

    type DMChannelResponse {
        ok: Boolean!
        errors: [Error!]
        id: Int!
        name: String!
    }

    type Mutation {
        createChannel(teamId: Int!, name: String!, private: Boolean=false, description: String, members: [Int!]=[]): ChannelResponse!
        getOrCreateChannel(teamId: Int!, members: [Int!]!): DMChannelResponse!
        updateChannel(channelId: Int!, option: ChannelUpdateOptions!, value: String!): ChannelResponse!
        deleteChannel(channelId: Int!): Boolean!
        starChannel(channelId: Int!): Boolean!
        unstarChannel(channelId: Int!): Boolean!
    }
`;
