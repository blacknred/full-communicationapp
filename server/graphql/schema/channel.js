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
        ok:Boolean!
        channel: Channel
        errors: [Error!]
    }

    type DMChannelResponse {
        id: Int!
        name: String!
    }

    type Mutation {
        createChannel(teamId: Int!, name: String!, private: Boolean=false, members: [Int!]=[]): ChannelResponse!
        getOrCreateChannel(teamId: Int!, members: [Int!]!): DMChannelResponse!
    }
`;
