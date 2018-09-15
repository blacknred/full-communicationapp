import React from 'react';
import PropTypes from 'prop-types';
import { findIndex } from 'lodash';
import { graphql } from 'react-apollo';

import { ALL_TEAMS_QUERY } from '../graphql/team';

import Sidebar from '../containers/Sidebar';
import Header from '../components/Header';
import Messages from '../components/Messages';
import SendMessage from '../components/SendMessage';

const ViewTeam = ({
    data: { loading, allTeams }, match: { params: { teamId, channelId } },
}) => {
    if (loading) return null;

    const teamIdX = teamId ? findIndex(allTeams, ['id', parseInt(teamId, 10)]) : 0;
    const team = allTeams[teamIdX];
    const channelIdX = channelId ? findIndex(team.channels, ['id', parseInt(channelId, 10)]) : 0;
    const channel = team.channels[channelIdX];

    return (
        <React.Fragment>
            <Sidebar
                teams={allTeams.map(t => ({
                    id: t.id,
                    letter: t.name.charAt(0).toUpperCase(),
                }))}
                team={team}
                teamIndex={teamIdX}
            />
            <Header channelName={channel.name} />
            <Messages channelId={channel.id} />
            <SendMessage channelName={channel.name} />
        </React.Fragment>
    );
};

ViewTeam.propTypes = {
    data: PropTypes.shape({
        loading: PropTypes.bool.isRequired,
        allTeams: PropTypes.array,
    }).isRequired,
    match: PropTypes.shape({
        teamId: PropTypes.string,
        channelId: PropTypes.string,
    }).isRequired,
};

export default graphql(ALL_TEAMS_QUERY)(ViewTeam);
