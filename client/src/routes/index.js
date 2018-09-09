import {
    BrowserRouter,
    Route,
    Switch,
} from 'react-router-dom';
import React from 'react';

import Home from './Home';
import Login from './Login';
import Register from './Register';
import StyleRoot from '../styleRoot';

const Index = () => (
    <BrowserRouter>
        <Switch>
            <Route path="/home" exact component={Home} />
            <Route path="/login" exact component={Login} />
            <Route path="/register" exact component={Register} />
        </Switch>
    </BrowserRouter>
);

export default StyleRoot(Index);
