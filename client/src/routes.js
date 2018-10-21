import {
    Route,
    Switch,
    Redirect,
    BrowserRouter,
} from 'react-router-dom';
import React from 'react';
import decode from 'jwt-decode';

import Teams from './containers/Teams';
import Login from './containers/Login';
import Register from './containers/Register';
import CreateTeam from './containers/CreateTeam';


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

const Index = () => (
    <BrowserRouter>
        <Switch>
            <Route path="/login" exact component={Login} />
            <Route path="/register" exact component={Register} />
            <PrivateRoute path="/new-team" exact component={CreateTeam} />
            <PrivateRoute path="/teams/:teamId?/:channelId?" exact component={Teams} />
            <Redirect to="/teams/" />
        </Switch>
    </BrowserRouter>
);

export default Index;
