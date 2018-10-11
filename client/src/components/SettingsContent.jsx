import React from 'react';
import PropTypes from 'prop-types';

import {
    List,
    ListItem,
    ListItemText,
    ListSubheader,
} from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';

const styles = theme => ({
    root: {
        flex: 1,
        marginLeft: theme.spacing.unit * 2,
    },
});

const SettingsContent = ({ classes }) => (
    <List className={classes.root}>
        <ListSubheader>Ui</ListSubheader>
        <ListItem>
            <ListItemText primary="App color" />
        </ListItem>
        <ListSubheader>Profile</ListSubheader>
        <ListItem>
            <ListItemText primary="Update user" />
        </ListItem>
        <ListItem>
            <ListItemText primary="Delete user" />
        </ListItem>
        <ListSubheader>Own Teams</ListSubheader>
        <ListItem>
            <ListItemText primary="Update team" />
        </ListItem>
        <ListItem>
            <ListItemText primary="Delete team" />
        </ListItem>
    </List>
);

SettingsContent.propTypes = {
    classes: PropTypes.objectOf(PropTypes.string).isRequired,
};

export default withStyles(styles)(SettingsContent);
