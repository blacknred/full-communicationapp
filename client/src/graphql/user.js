import gql from 'graphql-tag';

export const USER_QUERY = gql`
    query GetUser($userId: Int!) {
        getUser(userId: $userId) {
            username
        }
    }
`;

export const REGISTER_MUTATION = gql`
    mutation Register($username: String!, $email: String!, $password: String!) {
        register(username: $username, email: $email, password: $password) {
            ok
            errors {
                path
                message
            }
        }
    }
`;

export const LOGIN_MUTATION = gql`
    mutation Login($email: String!, $password: String!) {
        login(email: $email, password: $password) {
            ok
            token
            refreshToken
            errors {
                path
                message
            }
        }
    }
`;
