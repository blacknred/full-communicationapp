import React from 'react';
import PropTypes from 'prop-types';

import {
    List,
    Divider,
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

const SettingsProfile = ({ classes }) => (
    <List>
        <Divider light />
        <ListSubheader>Profile</ListSubheader>
        <ListItem>
            <ListItemText primary="Update user" />
        </ListItem>
        <ListItem>
            <ListItemText primary="Delete user" />
        </ListItem>
    </List>
);

SettingsProfile.propTypes = {
    classes: PropTypes.objectOf(PropTypes.string).isRequired,
};

export default withStyles(styles)(SettingsProfile);
