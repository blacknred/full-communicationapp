import React from 'react';
import decode from 'jwt-decode';
import PropTypes from 'prop-types';
import { findIndex } from 'lodash';
import { graphql } from 'react-apollo';
import { Redirect } from 'react-router-dom';
import { observer, inject } from 'mobx-react';

import Messages from './Messages';
import NewMessage from './NewMessage';
import TeamsSidebar from './TeamsSidebar';
import Loading from '../components/Loading';
import ChannelHeader from './ChannelHeader';
import ChannelSidebar from './ChannelSidebar';
import HomeWrapper from '../components/HomeWrapper';
import Notification from '../components/Notification';

import { GET_TEAMS_QUERY } from '../graphql/team';

const getValidIndex = (id, arr) => {
    const idInt = parseInt(id, 10);
    if (idInt) {
        const x = findIndex(arr, { id: idInt });
        if (x !== -1) return x;
    }
    return 0;
};

const Home = ({
    data: {
        loading, error, getTeams, updateQuery, refetch,
    }, match: { params: { teamId, channelId } },
    store: { createNotification },
}) => {
    if (loading) return <Loading />;
    if (error) {
        createNotification(error);
        return null;
    }
    if (!getTeams) refetch();
    if (!getTeams.length) return <Redirect to="/new" />;
    // console.log(getTeams);
    console.log('home render!!');

    const teamIndex = getValidIndex(teamId, getTeams);
    const team = getTeams[teamIndex];
    const channelIndex = getValidIndex(channelId, team.channels);
    const channel = team.channels[channelIndex];

    // const isChannelStarr = findIndex(team.starredChannels, { id: channelIndex });
    // const isChannelStarred = isChannelStarr > -1;
    const { user: { id: currentUserId } } = decode(localStorage.getItem('token'));
    const isTeamOwner = currentUserId === team.admin.id;

    // reset updates' count for current team and channel
    /* eslint-disable */
    try {
        updateQuery(() => {
            getTeams[teamIndex].updatesCount = 0;
            getTeams[teamIndex].channels[channelIndex].updatesCount = 0;
        });
    } catch (e) { }
    /* eslint-enable */

    return (
        <React.Fragment>
            <HomeWrapper>
                <TeamsSidebar
                    team={team}
                    teams={getTeams}
                    teamIndex={teamIndex}
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
                                teamId={team.id}
                                channel={channel}
                                teamName={team.name}
                                teamIndex={teamIndex}
                                isOwner={isTeamOwner}
                            />
                            <ChannelSidebar />
                            <Messages
                                channelId={channel.id}
                                userId={currentUserId}
                            />
                            <NewMessage
                                channelId={channel.id}
                                placeholder={channel.name}
                            />
                        </React.Fragment>
                    )
                }
            </HomeWrapper>
            <Notification />
        </React.Fragment>
    );
};

Home.propTypes = {
    match: PropTypes.shape({
        teamId: PropTypes.string,
        channelId: PropTypes.string,
    }).isRequired,
    data: PropTypes.shape().isRequired,
    store: PropTypes.shape().isRequired,
};

export default graphql(GET_TEAMS_QUERY)(
    inject('store')(observer(Home)),
);
