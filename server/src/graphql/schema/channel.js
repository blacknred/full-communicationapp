export default `
    type Channel {
        id: Int!
        dm: Boolean!
        name: String!
        description: String
        created_at: String
        private: Boolean!
        starred: Boolean
        updatesCount: Int!
        participantsCount: Int!
        messagesCount: Int
        filesCount: Int
        participants: [User!]
        dmOnline: Boolean
    }

    type ChannelResponse {
        ok: Boolean!
        channel: Channel
        errors: [Error!]
    }

    type Query {
        getChannel(channelId: Int!): Channel!
    }

    type Mutation {
        createChannel(teamId: Int!, name: String!, description: String, private: Boolean=false, members: [Int!]=[]): ChannelResponse!
        createDMChannel(teamId: Int!, members: [Int!]!): Channel!
        updateChannel(channelId: Int!, name: String!, private: Boolean!=false, description: String, members: [Int!]=[]): ChannelResponse!
        deleteChannel(channelId: Int!): Boolean!
        starChannel(channelId: Int!): Boolean!
        unstarChannel(channelId: Int!): Boolean!
    }
`;
