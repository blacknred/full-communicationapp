export default `
    type Team {
        id: Int!
        name: String!
        admin: User!
        channels: [Channel!]!
        directMessageMembers: [User!]!        
    }

    type Query {
        getTeams: [Team!]
        getTeamMembers(teamId: Int!): [User!]
    }

    type VoidResponse {
        ok: Boolean!
        errors: [Error!]
    }

    type TeamResponse {
        ok: Boolean!
        errors: [Error!]
        team: Team
    }

    type Mutation {
        createTeam(name: String!): TeamResponse!
        addTeamMember(teamId: Int!, email: String!): VoidResponse!
        updateTeam(teamId: Int!, option: String!, value: String!): TeamResponse!
        deleteTeam(teamId: Int!): Boolean!
    }
`;
