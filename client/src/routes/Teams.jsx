import {
    Route,
    Switch,
    Redirect,
} from 'react-router-dom';
import React from 'react';
import PropTypes from 'prop-types';
import { findIndex } from 'lodash';
import { graphql } from 'react-apollo';

import { ME_QUERY } from '../graphql/team';

import Header from '../containers/Header';
import Sidebar from '../containers/Sidebar';
import Loading from '../components/Loading';
import ContentWrapper from '../components/ContentWrapper';
import DirectMessages from '../containers/DirectMessages';
import ChannelMessages from '../containers/ChannelMessages';
import NewDirectMessage from '../containers/NewDirectMessage';
import NewChannelMessage from '../containers/NewChannelMessage';

const Teams = ({
    data: { loading, me },
    match: { params: { teamId, channelId, userId } },
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
            <ContentWrapper>
                <Switch>
                    <Route
                        exact
                        path="/teams/:teamId/user/:userId"
                        render={() => (
                            <React.Fragment>
                                <Header title="some username" />
                                <DirectMessages
                                    teamId={team.id}
                                    userId={userId}
                                />
                                <NewDirectMessage
                                    teamId={team.id}
                                    receiverId={userId}
                                    placeholder={userId}
                                />
                            </React.Fragment>
                        )}
                    />
                    <Route
                        exact
                        path="/teams/:teamId?/:channelId?"
                        render={() => (
                            channel && (
                                <React.Fragment>
                                    <Header title={channel.name} />
                                    <ChannelMessages channelId={channel.id} />
                                    <NewChannelMessage
                                        channelId={channel.id}
                                        placeholder={channel.name}
                                    />
                                </React.Fragment>
                            )
                        )}
                    />
                </Switch>
            </ContentWrapper>
        </React.Fragment>
    );
};

Teams.propTypes = {
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
        userId: PropTypes.string,
    }).isRequired,
};

export default graphql(
    ME_QUERY,
    {
        options: {
            fetchPolicy: 'network-only',
        },
    },
)(Teams);
