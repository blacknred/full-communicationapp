import React from 'react';
import gql from 'graphql-tag';
import { Query } from 'react-apollo';

class Register extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            username: '',
            email: '',
            password: ''
        };
    }
    
    render() {
        return (

        )
    }
}
export default () => (
    <Query query={gql`
        {
            register {
                id
                email
            }
        }
    `}
    >
        {
            ({ loading, error, data }) => {
                if (loading) return <p>Loading...</p>;
                if (error) return <p>Error :(</p>;
                return data.allUsers.map(u => (
                    <h1 key={u.id}>{u.email}</h1>
                ));
            }
        }
    </Query>
);
