import React from 'react';
import { Query } from 'react-apollo';

import { ALL_USERS_QUERY } from '../graphql/user';

export default () => (
    <Query query={ALL_USERS_QUERY}>
        {
            ({ loading, error, data }) => {
                if (loading) return <p>Loading...</p>;
                if (error) return <p>Error :(</p>;
                return (
                    <div>
                        {
                            data.allUsers.map(u => (
                                <h1 key={u.id}>{u.email}</h1>
                            ))
                        }
                    </div>
                );
            }
        }
    </Query>
);
