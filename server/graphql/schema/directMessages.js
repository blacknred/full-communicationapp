export default `
    type DirectMessage {
        id: Int!
        text: String!
        sender: User!
        receiverId: Int!
        # created_at: String!
    }

    type Query {
        directMessages: [DirectMessage!]!
    }

    type Mutation {
        createDirectMessage(receiverId: Int!, text: String!): Boolean!
    }
`;
