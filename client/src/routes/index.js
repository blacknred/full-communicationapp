import {
    Route,
    Switch,
    Redirect,
    BrowserRouter,
} from 'react-router-dom';
import React from 'react';
import decode from 'jwt-decode';

import Home from './Home';
import Login from './Login';
import Teams from './Teams';
import Register from './Register';
import StyleRoot from '../styleRoot';
import CreateTeam from './CreateTeam';

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
            <Route path="/" exact component={Home} />
            <Route path="/login" exact component={Login} />
            <Route path="/register" exact component={Register} />
            <Route path="/settings" exact component={Home} />
            <PrivateRoute path="/new-team" exact component={CreateTeam} />
            <PrivateRoute path="/teams/:teamId?" exact component={Teams} />
        </Switch>
    </BrowserRouter>
);

export default StyleRoot(Index);
