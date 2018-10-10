import React from 'react';
import PropTypes from 'prop-types';
import { findIndex } from 'lodash';
import { graphql, compose } from 'react-apollo';
import gql from 'graphql-tag';

import NewMessage from './NewMessage';
import ContentHeader from './ContentHeader';
import DirectMessages from './DirectMessages';

import { ME_QUERY } from '../graphql/user';
import { CREATE_DIRECT_MESSAGE_MUTATION } from '../graphql/message';


const USER_QUERY = gql`
    query GetUser($userId: Int!) {
        getUser(userId: $userId) {
            username
            online
        }
    }
`;

const MemberContent = ({
    teamId, userId, mutate, data: { loading, getUser },
}) => {
    const userIdInt = parseInt(userId, 10);
    return !loading && (
        <React.Fragment>
            <ContentHeader
                title={getUser.username}
                status={getUser.online ? 'Online' : 'Offline'}
            />
            <DirectMessages
                teamId={teamId}
                userId={userIdInt}
            />
            <NewMessage
                placeholder={getUser.username}
                submit={async (text) => {
                    await mutate({
                        variables: {
                            teamId,
                            receiverId: userIdInt,
                            text,
                        },
                        optimisticResponse: {
                            createDirectMessage: true,
                        },
                        update: (store) => {
                            const data = store.readQuery({ query: ME_QUERY });
                            const teamIdX = findIndex(data.me.teams, ['id', teamId]);
                            const notYetThere = data.me.teams[teamIdX].directMessageMembers
                                .every(member => member.id !== parseInt(userIdInt, 10));
                            if (!notYetThere) return;
                            data.me.teams[teamIdX].directMessageMembers.push({
                                __typename: 'User',
                                id: userIdInt,
                                username: 'someone',
                            });
                            store.writeQuery({ query: ME_QUERY, data });
                        },
                    });
                }}
            />
        </React.Fragment>
    );
};

MemberContent.propTypes = {
    data: PropTypes.shape({
        loading: PropTypes.bool.isRequired,
        getUser: PropTypes.shape({
            username: PropTypes.string.isRequired,
        }),
    }).isRequired,
    teamId: PropTypes.number.isRequired,
    userId: PropTypes.string,
    mutate: PropTypes.func.isRequired,
};

export default compose(
    graphql(
        USER_QUERY,
        {
            options: props => ({
                variables: {
                    userId: parseInt(props.userId, 10),
                },
            }),
        },
    ),
    graphql(CREATE_DIRECT_MESSAGE_MUTATION),
)(MemberContent);
