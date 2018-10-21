export default `
    type User {
        id: Int!
        username: String!
        email: String!
        online: Boolean!
    }

    type UserResponse {
        ok: Boolean!
        user: User
        errors: [Error!]
    }

    type LoginResponse {
        ok: Boolean!
        token: String
        refreshToken: String
        errors: [Error!]
    }

    type Query {
        getCurrentUser: User!
    }

    type Mutation {
        register(username: String!, email: String!, password: String!): UserResponse!
        login(email: String!, password: String!): LoginResponse!
        updateUser(option: String!, value: String!): UserResponse!
        deleteUser: Boolean!
    }
`;
