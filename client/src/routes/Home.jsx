import React from 'react';
import { Query } from 'react-apollo';

import { ALL_USERS_QUERY } from '../graphql/user';

import Loading from '../components/Loading';

export default () => (
    <Query query={ALL_USERS_QUERY}>
        {
            ({ loading, error, data }) => {
                if (loading) return <Loading />;
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
