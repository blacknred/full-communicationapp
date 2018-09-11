import React from 'react';
import PropTypes from 'prop-types';

import {
    List,
    Drawer,
    Divider,
    ListItem,
    Toolbar,
    withStyles,
    Typography,
    ListItemText,
    ListItemIcon,
    ListSubheader,
} from '@material-ui/core';
import {
    // RadioButtonChecked,
    // RadioButtonUnchecked,
    FiberManualRecord,
} from '@material-ui/icons';

const drawerWidth = 240;

const styles = theme => ({
    drawerPaper: {
        position: 'relative',
        width: drawerWidth,
        backgroundColor: theme.palette.primary.main,
        color: theme.palette.primary.contrastText,
    },
    toolbar: theme.mixins.toolbar,
    iconRoot: {
        color: theme.palette.secondary.main,
    },
});

const Channels = ({
    classes, teamName, users, username, channels,
}) => {
    const channelsList = channels.map(channel => (
        <ListItem
            key={`channel-${channel.id}`}
            button
        >
            <ListItemText
                primary={`# ${channel.name}`}
                primaryTypographyProps={{
                    color: 'inherit', variant: 'body2',
                }}
            />
        </ListItem>
    ));

    const usersList = users.map(user => (
        <ListItem
            key={`channel-user-${user.id}`}
            button
            color="secondary"
        >
            <ListItemIcon className={classes.iconRoot}>
                <FiberManualRecord />
            </ListItemIcon>
            <ListItemText
                inset
                primary={user.name}
                primaryTypographyProps={{
                    color: 'inherit', variant: 'body2',
                }}
            />
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
            <List>
                <ListItem>
                    <ListItemText
                        primary={teamName}
                        secondary={username}
                        primaryTypographyProps={{
                            color: 'inherit',
                        }}
                    />
                </ListItem>
            </List>
            <Divider />
            <List
                dense
                subheader={(
                    <ListSubheader color="inherit">
                        Channels
                    </ListSubheader>
                )}
            >
                {channelsList}
            </List>
            <List
                dense
                subheader={(
                    <ListSubheader color="inherit">
                        Direct Messages
                    </ListSubheader>
                )}
            >
                {usersList}
            </List>
            <Divider />
        </Drawer>
    );
};

Channels.propTypes = {
    classes: PropTypes.objectOf(PropTypes.string).isRequired,
    teamName: PropTypes.string.isRequired,
    username: PropTypes.string.isRequired,
    channels: PropTypes.arrayOf(PropTypes.shape({
        id: PropTypes.number.isRequired,
        name: PropTypes.string.isRequired,
    })).isRequired,
    users: PropTypes.arrayOf(PropTypes.shape({
        id: PropTypes.number.isRequired,
        name: PropTypes.string.isRequired,
    })).isRequired,
};

export default withStyles(styles)(Channels);
