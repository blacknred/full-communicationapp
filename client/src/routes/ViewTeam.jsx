import React from 'react';
import PropTypes from 'prop-types';
import { findIndex } from 'lodash';
import { graphql } from 'react-apollo';
import { Redirect } from 'react-router-dom';

import { ALL_TEAMS_QUERY } from '../graphql/team';

import Sidebar from '../containers/Sidebar';
import Header from '../components/Header';
import Messages from '../components/Messages';
import SendMessage from '../components/SendMessage';

const ViewTeam = ({
    data: { loading, allTeams, inviteTeams },
    match: { params: { teamId, channelId } },
}) => {
    if (loading) return null;
    const teams = [...allTeams, ...inviteTeams];

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
                teams={teams.map(t => ({
                    id: t.id,
                    letter: t.name.charAt(0).toUpperCase(),
                }))}
                team={team}
                teamIndex={teamIdX}
            />
            {
                channel && (
                    <React.Fragment>
                        <Header channelName={channel.name} />
                        <Messages channelId={channel.id} />
                        <SendMessage channelName={channel.name} />
                    </React.Fragment>
                )
            }
        </React.Fragment>
    );
};

ViewTeam.propTypes = {
    data: PropTypes.shape({
        loading: PropTypes.bool.isRequired,
        allTeams: PropTypes.array,
        inviteTeams: PropTypes.array,
    }).isRequired,
    match: PropTypes.shape({
        teamId: PropTypes.string,
        channelId: PropTypes.string,
    }).isRequired,
};

export default graphql(ALL_TEAMS_QUERY)(ViewTeam);
