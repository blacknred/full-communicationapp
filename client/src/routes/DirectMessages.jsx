import React from 'react';
import PropTypes from 'prop-types';
import { findIndex } from 'lodash';
import { Redirect } from 'react-router-dom';
import { graphql, compose } from 'react-apollo';

import { ME_QUERY } from '../graphql/team';
import { CREATE_DIRECT_MESSAGE_MUTATION } from '../graphql/message';

import Header from '../containers/Header';
import Sidebar from '../containers/Sidebar';
import Loading from '../components/Loading';
import Messages from '../containers/Messages';
import SendMessage from '../containers/SendMessage';

const DirectMessages = ({
    mutate,
    data: { loading, me },
    match: { params: { teamId, userId } },
}) => {
    if (loading) return <Loading />;

    const { username, teams } = me;

    if (!teams.length) return <Redirect to="/create-team" />;

    const teamIdInt = parseInt(teamId, 10);
    const teamIdX = teamIdInt ? findIndex(teams, ['id', teamIdInt]) : 0;
    const team = teamIdX === -1 ? teams[0] : teams[teamIdX];

    return (
        <React.Fragment>
            <Sidebar
                teams={teams}
                team={team}
                username={username}
                teamIndex={teamIdX}
            />
            {/* <Header channelName={channel.name} />
            <Messages channelId={channel.id} /> */}
            <SendMessage
                onSubmit={async (text) => {
                    await mutate({
                        variables: {
                            teamId: team.id,
                            receiverId: '',
                            text,
                        },
                    });
                }}
                placeholder={userId}
            />
        </React.Fragment>
    );
};

DirectMessages.propTypes = {
    mutate: PropTypes.func.isRequired,
    data: PropTypes.shape({
        loading: PropTypes.bool.isRequired,
        me: PropTypes.shape({
            id: PropTypes.number.isRequired,
            username: PropTypes.string.isRequired,
            admin: PropTypes.bool,
            teams: PropTypes.arrayOf(PropTypes.shape).isRequired,
        }),
    }).isRequired,
    match: PropTypes.shape({
        teamId: PropTypes.string,
        userId: PropTypes.string,
    }).isRequired,
};

export default compose(
    graphql(
        ME_QUERY,
        {
            options: {
                fetchPolicy: 'network-only',
            },
        },
    ),
    graphql(CREATE_DIRECT_MESSAGE_MUTATION),
)(DirectMessages);
