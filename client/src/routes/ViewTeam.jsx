import React from 'react';
import PropTypes from 'prop-types';
import { findIndex } from 'lodash';
import { graphql } from 'react-apollo';
import { Redirect } from 'react-router-dom';

import { ME_QUERY } from '../graphql/team';

import Header from '../containers/Header';
import Sidebar from '../containers/Sidebar';
import Loading from '../components/Loading';
import Messages from '../containers/Messages';
import SendMessage from '../containers/SendMessage';

const ViewTeam = ({
    data: { loading, me },
    match: { params: { teamId, channelId } },
}) => {
    if (loading) return <Loading />;

    const { username, teams } = me;

    if (!teams.length) return <Redirect to="/create-team" />;

    const teamIdInt = parseInt(teamId, 10);
    const teamIdX = teamIdInt ? findIndex(teams, ['id', teamIdInt]) : 0;
    const team = teamIdX === -1 ? teams[0] : teams[teamIdX];

    const channelIdInt = parseInt(channelId, 10);
    const channelIdX = channelIdInt ? findIndex(team.channels, ['id', channelIdInt]) : 0;
    const channel = channelIdX === -1 ? team.channels[0] : team.channels[channelIdX];

    return (
        <React.Fragment>
            <Sidebar
                teams={teams}
                team={team}
                username={username}
                teamIndex={teamIdX}
            />
            {
                channel && (
                    <React.Fragment>
                        <Header channelName={channel.name} />
                        <Messages channelId={channel.id} />
                        <SendMessage
                            channelId={channel.id}
                            channelName={channel.name}
                        />
                    </React.Fragment>
                )
            }
        </React.Fragment>
    );
};

ViewTeam.propTypes = {
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
        channelId: PropTypes.string,
    }).isRequired,
};

export default graphql(
    ME_QUERY,
    {
        options: {
            fetchPolicy: 'network-only',
        },
    },
)(ViewTeam);
