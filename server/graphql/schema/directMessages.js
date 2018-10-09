export default `
    type DirectMessage {
        id: Int!
        text: String
        sender: User!
        receiverId: Int!
        created_at: String!
        files: [File!]
    }

    type Subscription {
        newDirectMessage(teamId: Int!, userId: Int!): DirectMessage!
    }

    type Query {
        directMessages(teamId: Int!, otherUserId: Int!): [DirectMessage!]!
    }

    type Mutation {
        createDirectMessage(teamId: Int!, receiverId: Int!, text: String, files: [File!]): Boolean!
    }
`;
