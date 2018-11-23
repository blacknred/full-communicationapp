export default `
    type Team {
        id: Int!
        name: String!
        description: String
        admin: User!
        channels: [Channel!]!
        directMessageMembers: [User!]
        updatesCount: Int!
        membersCount: Int!
    }

    type Query {
        getTeams: [Team!]
        getTeamMembers(teamId: Int!): [User!]
    }

    type MemberResponse {
        ok: Boolean!
        errors: [Error!]
        status: String
    }

    type TeamResponse {
        ok: Boolean!
        errors: [Error!]
        team: Team
    }

    type Mutation {
        createTeam(name: String!, description: String): TeamResponse!
        addTeamMember(teamId: Int!, email: String!): MemberResponse!
        updateTeam(teamId: Int!, name: String!, description: String): TeamResponse!
        deleteTeam(teamId: Int!): Boolean!
    }
`;
