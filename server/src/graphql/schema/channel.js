export default `
    type Channel {
        id: Int!
        dm: Boolean!
        name: String!
        description: String
        created_at: String
        private: Boolean!
        starred: Boolean!
        updatesCount: Int!
        membersCount: Int!
        messagesCount: Int
        filesCount: Int
    }

    type Query {
        getChannelInfo(channelId: Int!): Channel
        getChannelMembers(channelId: Int!): [User!]
    }

    type ChannelResponse {
        ok: Boolean!
        channel: Channel
        errors: [Error!]
    }

    type Mutation {
        createChannel(teamId: Int!, name: String!, private: Boolean!=false, description: String, members: [Int!]=[]): ChannelResponse!
        createDMChannel(teamId: Int!, members: [Int!]!): Channel!
        updateChannel(channelId: Int!, name: String!, private: Boolean!=false, description: String, members: [Int!]=[]): ChannelResponse!
        deleteChannel(channelId: Int!): Boolean!
        starChannel(channelId: Int!): Boolean!
        unstarChannel(channelId: Int!): Boolean!
    }
`;
