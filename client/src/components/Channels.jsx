import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

import {
    List,
    Drawer,
    Divider,
    ListItem,
    IconButton,
    ListItemText,
    ListItemIcon,
    ListSubheader,
    ListItemSecondaryAction,
} from '@material-ui/core';
import {
    FiberManualRecord,
    Add,
    Lock,
    LockOpen,
} from '@material-ui/icons';
import { withStyles } from '@material-ui/core/styles';

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
        width: '0.8em',
        margin: 0,
    },
});

const Channels = ({
    classes, teamName, teamId, users, username, channels,
    onAddChannel, onInvitePeople, isOwner,
}) => {
    const channelsList = channels.map(ch => (
        <ListItem
            key={`channel-${ch.id}`}
            button
            component={Link}
            to={`/view-team/${teamId}/${ch.id}`}
        >
            <ListItemIcon className={classes.iconRoot}>
                {ch.public ? <LockOpen /> : <Lock />}
            </ListItemIcon>
            <ListItemText
                primary={`# ${ch.name}`}
                primaryTypographyProps={{
                    color: 'inherit',
                    variant: 'body2',
                }}
            />
        </ListItem>
    ));

    const usersList = users.map(({ id, name }) => (
        <ListItem
            key={`channel-user-${id}`}
            button
            color="secondary"
        >
            <ListItemIcon className={classes.iconRoot}>
                <FiberManualRecord />
            </ListItemIcon>
            <ListItemText
                inset
                primary={name}
                primaryTypographyProps={{
                    color: 'inherit',
                    variant: 'body2',
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
                        <span>Channels</span>
                        {
                            isOwner && (
                                <ListItemSecondaryAction>
                                    <IconButton color="secondary" onClick={onAddChannel}>
                                        <Add />
                                    </IconButton>
                                </ListItemSecondaryAction>
                            )
                        }
                    </ListSubheader>
                )}
            >
                {channelsList}
            </List>
            <Divider />
            <List
                dense
                subheader={(
                    <ListSubheader color="inherit">
                        Direct Messages
                    </ListSubheader>
                )}
            >
                {usersList}
                {
                    isOwner && (
                        <ListItem
                            key="invite-people"
                            button
                            color="secondary"
                            onClick={onInvitePeople}
                        >
                            <ListItemText
                                primary="+ Invite People"
                                primaryTypographyProps={{
                                    color: 'secondary',
                                    variant: 'button',
                                }}
                            />
                        </ListItem>
                    )
                }
            </List>
        </Drawer>
    );
};

Channels.propTypes = {
    classes: PropTypes.objectOf(PropTypes.string).isRequired,
    teamName: PropTypes.string.isRequired,
    username: PropTypes.string.isRequired,
    teamId: PropTypes.number.isRequired,
    channels: PropTypes.arrayOf(PropTypes.shape({
        id: PropTypes.number.isRequired,
        name: PropTypes.string.isRequired,
        public: PropTypes.bool.isRequired,
    })).isRequired,
    isOwner: PropTypes.bool.isRequired,
    users: PropTypes.arrayOf(PropTypes.shape({
        id: PropTypes.number.isRequired,
        name: PropTypes.string.isRequired,
    })).isRequired,
    onAddChannel: PropTypes.func.isRequired,
    onInvitePeople: PropTypes.func.isRequired,
};

export default withStyles(styles)(Channels);
