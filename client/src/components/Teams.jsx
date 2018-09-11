import React from 'react';
import PropTypes from 'prop-types';

import {
    List,
    Avatar,
    Drawer,
    ListItem,
    withStyles,
} from '@material-ui/core';

const drawerWidth = 90;

const styles = theme => ({
    drawerPaper: {
        position: 'relative',
        width: drawerWidth,
        backgroundColor: theme.palette.primary.dark,
        color: theme.palette.primary.dark,
    },
    toolbar: theme.mixins.toolbar,
    avatar: {
        backgroundColor: theme.palette.primary.main,
    },
});

const Teams = ({ classes, teams }) => {
    const teamsList = teams.map(team => (
        <ListItem
            key={`team-${team.id}`}
            button
        >
            <Avatar className={classes.avatar}>
                {team.letter}
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
            </List>
        </Drawer>
    );
};

Teams.propTypes = {
    classes: PropTypes.objectOf(PropTypes.string).isRequired,
    teams: PropTypes.arrayOf(PropTypes.shape({
        id: PropTypes.number.isRequired,
        letter: PropTypes.string.isRequired,
    })).isRequired,
};

export default withStyles(styles)(Teams);
