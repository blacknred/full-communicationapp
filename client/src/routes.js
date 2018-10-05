import {
    Route,
    Switch,
    Redirect,
    BrowserRouter,
} from 'react-router-dom';
import React from 'react';
import decode from 'jwt-decode';
import PropTypes from 'prop-types';
import { findIndex } from 'lodash';
import { Query } from 'react-apollo';

import StyleRoot from './styleRoot';
import Login from './containers/Login';
import Loading from './components/Loading';
import Sidebar from './containers/Sidebar';
import Register from './containers/Register';
import CreateTeam from './containers/CreateTeam';
import MemberContent from './containers/MemberContent';
import ChannelContent from './containers/ChannelContent';
import ContentWrapper from './components/ContentWrapper';

import { ME_QUERY } from './graphql/team';

const isAuthenticated = () => {
    const token = localStorage.getItem('token');
    const refreshToken = localStorage.getItem('refreshToken');
    try {
        decode(token);
        decode(refreshToken);
    } catch (err) {
        return false;
    }
    return true;
};

const PrivateRoute = ({ component: Component, ...rest }) => (
    <Route
        {...rest}
        render={props => (
            isAuthenticated()
                ? <Component {...props} />
                : (
                    <Redirect
                        to={{
                            pathname: '/login',
                            state: { from: props.location },
                        }}
                    />
                )
        )}
    />
);

const TeamsRoute = ({ match: { params: { teamId } } }) => (
    <Query
        query={ME_QUERY}
        fetchPolicy="network-only"
    >
        {({ loading, error, data }) => {
            if (loading || error) return <Loading />;

            const { me: { teams } } = data;

            if (!teams.length) return <Redirect to="/create-team" />;

            const teamIdInt = parseInt(teamId, 10);
            const teamIdX = teamIdInt ? findIndex(teams, ['id', teamIdInt]) : 0;
            const team = teamIdX === -1 ? teams[0] : teams[teamIdX];
            const token = localStorage.getItem('token');
            const { user: { id } } = decode(token);
            const isTeamOwner = id === team.admin.id;

            return (
                <React.Fragment>
                    <Sidebar
                        team={team}
                        teams={teams}
                        isOwner={isTeamOwner}
                        teamIndex={teamIdX}
                    />
                    <ContentWrapper>
                        <Switch>
                            <Route
                                exact
                                path="/teams/:teamId/user/:userId"
                                render={({ match: { params: { userId } } }) => (
                                    <MemberContent
                                        teamId={team.id}
                                        userId={userId}
                                    />
                                )}
                            />
                            <Route
                                exact
                                path="/teams/:teamId?/:channelId?"
                                render={({ match: { params: { channelId } } }) => (
                                    <ChannelContent
                                        channels={team.channels}
                                        channelId={channelId}
                                    />
                                )}
                            />
                        </Switch>
                    </ContentWrapper>
                </React.Fragment>
            );
        }}
    </Query>
);

TeamsRoute.propTypes = {
    match: PropTypes.shape({
        teamId: PropTypes.string,
    }).isRequired,
};

const Index = () => (
    <BrowserRouter>
        <Switch>
            <Route path="/login" exact component={Login} />
            <Route path="/register" exact component={Register} />
            {/* <Route path="/settings" exact component={Settings} /> */}
            <PrivateRoute path="/new-team" exact component={CreateTeam} />
            <PrivateRoute path="/teams/:teamId?" component={TeamsRoute} />
            <Redirect to="/teams" />
        </Switch>
    </BrowserRouter>
);

export default StyleRoot(Index);
