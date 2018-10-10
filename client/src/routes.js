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
import Error from './components/Error';
import Loading from './components/Loading';
import Sidebar from './containers/Sidebar';
import Register from './containers/Register';
import Messages from './containers/Messages';
import NewMessage from './containers/NewMessage';
import CreateTeam from './containers/CreateTeam';
import ContentHeader from './containers/ContentHeader';
import ContentWrapper from './components/ContentWrapper';

import { ME_QUERY } from './graphql/user';

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

const TeamsRoute = ({ match: { params: { teamId, channelId } } }) => (
    <Query
        query={ME_QUERY}
        fetchPolicy="network-only"
    >
        {({ loading, error, data: { me } }) => {
            if (loading || !me) return <Loading />;
            if (error) return <Error text={error} />;
            const { id: currentUserId, teams } = me;

            if (!teams.length) return <Redirect to="/new-team" />;

            const teamIdInt = parseInt(teamId, 10);
            const teamIdX = teamIdInt ? findIndex(teams, ['id', teamIdInt]) : 0;
            const team = teamIdX === -1 ? teams[0] : teams[teamIdX];

            const channelIdInt = parseInt(channelId, 10);
            const channelIdX = channelIdInt ? findIndex(team.channels, ['id', channelIdInt]) : 0;
            const channel = channelIdX === -1 ? team.channels[0] : team.channels[channelIdX];

            return (
                <React.Fragment>
                    <Sidebar
                        team={team}
                        teams={teams}
                        isOwner={currentUserId === team.admin.id}
                        teamIndex={teamIdX}
                    />
                    {
                        channel && (
                            <ContentWrapper>
                                <ContentHeader
                                    title={channel.name}
                                    status={channel.public ? 'Public' : 'Private'}
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
        }}
    </Query>
);

TeamsRoute.propTypes = {
    match: PropTypes.shape({
        teamId: PropTypes.string,
        channelId: PropTypes.string,
    }).isRequired,
};

const Index = () => (
    <BrowserRouter>
        <Switch>
            <Route path="/login" exact component={Login} />
            <Route path="/register" exact component={Register} />
            {/* <Route path="/settings" exact component={Settings} /> */}
            <PrivateRoute path="/new-team" exact component={CreateTeam} />
            <PrivateRoute path="/teams/:teamId?/:channelId" exact component={TeamsRoute} />
            <Redirect to="/teams" />
        </Switch>
    </BrowserRouter>
);

export default StyleRoot(Index);
