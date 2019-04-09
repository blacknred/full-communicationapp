export default `
    enum UserUpdateOptions {
        username
        fullname
        email
    }

    type User {
        id: Int!
        email: String!
        username: String!
        fullname: String
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
        getUser: User!
    }

    type Mutation {
        register(username: String!, email: String!, password: String!, teamToken: String): UserResponse!
        login(email: String!, password: String!, teamToken: String): LoginResponse!
        updateUser(option: UserUpdateOptions!, value: String!): UserResponse!
        updateUserPassword(oldPassword: String!, password: String!): UserResponse!
        deleteUser: Boolean!
    }
`;
