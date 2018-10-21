import React from 'react';
import PropTypes from 'prop-types';
import { findIndex } from 'lodash';
import { Query } from 'react-apollo';
import decode from 'jwt-decode';
import { Redirect } from 'react-router-dom';

import StyleRoot from '../styleRoot';
import ChannelHeader from './ChannelHeader';
import Messages from './Messages';
import NewMessage from './NewMessage';
import ContentWrapper from '../components/ContentWrapper';
import Error from '../components/Error';
import Loading from '../components/Loading';
import Sidebar from './Sidebar';

import { GET_TEAMS_QUERY } from '../graphql/team';


const Teams = ({ match: { params: { teamId, channelId } } }) => (
    <Query
        query={GET_TEAMS_QUERY}
        fetchPolicy="network-only"
    >
        {({
            loading, error, data, updateQuery,
        }) => {
            if (loading || !data) return <Loading />;
            if (error) return <Error text={error} />;
            const { getTeams } = data;
            if (!getTeams.length) return <Redirect to="/new-team" />;

            const teamIdInt = parseInt(teamId, 10);
            const teamIdX = teamIdInt ? findIndex(getTeams, ['id', teamIdInt]) : 0;
            const team = teamIdX === -1 ? getTeams[0] : getTeams[teamIdX];

            const { user: { id: currentUserId } } = decode(localStorage.getItem('token'));
            const isTeamOwner = currentUserId === team.admin.id;
            const channelIdInt = parseInt(channelId, 10);
            const channelIdX = channelIdInt ? findIndex(team.channels, ['id', channelIdInt]) : 0;
            const channel = channelIdX === -1 ? team.channels[0] : team.channels[channelIdX];
            const isChannelStarred = findIndex(team.starredChannels, ['id', channel.id]) > -1;

            return (
                <React.Fragment>
                    <Sidebar
                        team={team}
                        teams={getTeams}
                        teamIndex={teamIdX}
                        channelIndex={channelIdX}
                        isOwner={isTeamOwner}
                        // channelSmartId={
                        //     `${isChannelStarred ? 'starred' : 'channel'}-${channel.id}`
                        // }
                        channelId={channel.id}
                        updateQuery={updateQuery}
                    />
                    {
                        channel && (
                            <ContentWrapper>
                                <ChannelHeader
                                    channel={channel}
                                    teamIndex={teamIdX}
                                    isOwner={isTeamOwner}
                                    isStarred={isChannelStarred}
                                />
                                <Messages channelId={channel.id} />
                                <NewMessage
                                    channelId={channel.id}
                                    placeholder={channel.name}
                                />
                            </ContentWrapper>
                        )
                    }
                </React.Fragment>
            );
        }
        }
    </Query>
);

Teams.propTypes = {
    match: PropTypes.shape({
        teamId: PropTypes.string,
        channelId: PropTypes.string,
    }).isRequired,
};

export default StyleRoot(Teams);
