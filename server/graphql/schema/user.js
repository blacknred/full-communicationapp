export default `
    type User {
        id: Int!
        username: String!
        email: String!
        online: Boolean!
    }

    type UserResponse {
        ok: Boolean!
        errors: [Error!]
        user: User
    }

    type LoginResponse {
        ok: Boolean!
        errors: [Error!]
        token: String
        refreshToken: String
    }

    type Mutation {
        register(username: String!, email: String!, password: String!): UserResponse!
        login(email: String!, password: String!): LoginResponse!
        updateUser(option: String!, value: String!): UserResponse!
        deleteUser(): Boolean!
    }
`;
