import {
    BrowserRouter,
    Route,
    Switch,
} from 'react-router-dom';
import React from 'react';

import Home from './Home';

export default () => (
    <BrowserRouter>
        <Switch>
            <Route path="/" component={Home} />
        </Switch>
    </BrowserRouter>
);
