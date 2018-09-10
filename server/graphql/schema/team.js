export default `
    type Team {
        id: Int!
        owner: User!
        members: [User!]!
        channels: [Channel!]!
    }

    type CreateTeamResponse {
        ok: Boolean!
        errors: [Error!]
    }

    type Mutation {
        createTeam(name: String!): CreateTeamResponse!
    }
`;
