export default `
    type Team {
        id: Int!
        name: String!
        members: [User!]!
        channels: [Channel!]!
    }

    type CreateTeamResponse {
        ok: Boolean!
        team: Team!
        errors: [Error!]
    }

    type Query {
        allTeams: [Team]!
    }

    type Mutation {
        createTeam(name: String!): CreateTeamResponse!
    }
`;
