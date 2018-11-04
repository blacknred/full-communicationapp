import React from 'react';
import decode from 'jwt-decode';
import PropTypes from 'prop-types';
import { findIndex } from 'lodash';
import { graphql } from 'react-apollo';
import { Redirect } from 'react-router-dom';

import Messages from './Messages';
import Sidebar from './TeamsSidebar';
import NewMessage from './NewMessage';
import ChannelHeader from './ChannelHeader';
import Loading from '../components/Loading';
import AppWrapper from '../components/AppWrapper';
import Notification from '../components/Notification';

import { GET_TEAMS_QUERY } from '../graphql/team';

const Home = ({
    data: {
        loading, error, getTeams = [], updateQuery,
    }, match: { params: { teamId, channelId } },
}) => {
    if (loading || !getTeams) return <Loading />;
    if (error) return <Notification text={error} />;

    if (!getTeams.length) return <Redirect to="/new" />;

    const teamIdInt = parseInt(teamId, 10);
    const teamIdX = teamIdInt ? findIndex(getTeams, { id: teamIdInt }) : 0;
    const team = teamIdX === -1 ? getTeams[0] : getTeams[teamIdX];

    const { user: { id: currentUserId } } = decode(localStorage.getItem('token'));
    const isTeamOwner = currentUserId === team.admin.id;
    const channelIdInt = parseInt(channelId, 10);
    const channelIdX = channelIdInt ? findIndex(team.channels, { id: channelIdInt }) : 0;
    const channel = channelIdX === -1 ? team.channels[0] : team.channels[channelIdX];
    const isChannelStarred = findIndex(team.starredChannels, { id: channel.id }) > -1;

    // reset updates' count for current team and channel
    /* eslint-disable */
    try {
        updateQuery(() => {
            getTeams[teamIdX].updatesCount = 0;
            getTeams[teamIdX].channels[channelIdX].updatesCount = 0;
        });
    } catch (e) {}
    /* eslint-enable */

    return (
        <AppWrapper>
            <Sidebar
                team={team}
                teams={getTeams}
                teamIndex={teamIdX}
                isOwner={isTeamOwner}
                channelId={channel.id}
            // channelSmartId={
            //     `${isChannelStarred ? 'starred' : 'channel'}-${channel.id}`
            // }
            />
            {
                channel && (
                    <React.Fragment>
                        <ChannelHeader
                            channel={channel}
                            teamId={team.id}
                            teamIndex={teamIdX}
                            isOwner={isTeamOwner}
                            isStarred={isChannelStarred}
                        />
                        <Messages channelId={channel.id} />
                        <NewMessage
                            channelId={channel.id}
                            placeholder={channel.name}
                        />
                    </React.Fragment>
                )
            }
            <Notification />
        </AppWrapper>
    );
};

Home.propTypes = {
    match: PropTypes.shape({
        teamId: PropTypes.string,
        channelId: PropTypes.string,
    }).isRequired,
    data: PropTypes.shape().isRequired,
};

export default graphql(GET_TEAMS_QUERY)(Home);
