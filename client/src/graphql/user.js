import gql from 'graphql-tag';

export const ME_QUERY = gql`
    {
        me {
            id
            username
            teams {
                id
                name
                admin {
                    id
                    username
                    online
                }
                channels {
                    id
                    name
                    public
                }
                directMessageMembers {
                    id
                    username
                    online
                }
            }
        }
    }
`;

export const USER_QUERY = gql`
    query GetUser($userId: Int!) {
        getUser(userId: $userId) {
            username
            online
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
