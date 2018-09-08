export default `
    type Team {
        id: Int!
        owner: User!
        members: [User!]!
        channels: [Channel!]!
    }

    type Mutation {
        createTeam(name: String!): Boolean!
    }
`;
