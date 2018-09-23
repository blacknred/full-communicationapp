import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

import {
    List,
    Avatar,
    Drawer,
    ListItem,
} from '@material-ui/core';
import { Add } from '@material-ui/icons';
import { withStyles } from '@material-ui/core/styles';

const DRAWER_WIDTH = 90;

const styles = theme => ({
    drawerPaper: {
        position: 'relative',
        width: DRAWER_WIDTH,
        backgroundColor: theme.palette.primary.dark,
        color: theme.palette.primary.dark,
    },
    toolbar: theme.mixins.toolbar,
    avatar: {
        backgroundColor: theme.palette.primary.main,
    },
});

const TeamsList = ({ classes, teams }) => {
    const teamsList = teams.map(({ id, name }) => (
        <ListItem
            key={`team-${id}`}
            button
            component={Link}
            to={`/view-team/${id}`}
        >
            <Avatar className={classes.avatar}>
                {name.charAt(0).toUpperCase()}
            </Avatar>
        </ListItem>
    ));

    return (
        <Drawer
            variant="permanent"
            classes={{
                paper: classes.drawerPaper,
            }}
            anchor="right"
        >
            <List className={classes.toolbar}>
                {teamsList}
                <ListItem
                    key="new-team"
                    button
                    component={Link}
                    to="/create-team"
                >
                    <Avatar className={classes.avatar}>
                        <Add color="secondary" />
                    </Avatar>
                </ListItem>
            </List>
        </Drawer>
    );
};

TeamsList.propTypes = {
    classes: PropTypes.objectOf(PropTypes.string).isRequired,
    teams: PropTypes.arrayOf(PropTypes.shape({
        id: PropTypes.number.isRequired,
        name: PropTypes.string.isRequired,
    })).isRequired,
};

export default withStyles(styles)(TeamsList);
