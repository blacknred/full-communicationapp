import {
    BrowserRouter,
    Route,
    Switch,
} from 'react-router-dom';
import React from 'react';

import Home from './Home';
import Login from './Login';
import Register from './Register';
import CreateTeam from './CreateTeam';
import StyleRoot from '../styleRoot';

const Index = () => (
    <BrowserRouter>
        <Switch>
            <Route path="/" exact component={Home} />
            <Route path="/login" component={Login} />
            <Route path="/register" component={Register} />
            <Route path="/create-team" component={CreateTeam} />
        </Switch>
    </BrowserRouter>
);

export default StyleRoot(Index);
