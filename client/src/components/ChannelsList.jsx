import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

import {
    List,
    Divider,
    ListItem,
    IconButton,
    ListItemText,
    ListItemIcon,
    ListSubheader,
    ListItemSecondaryAction,
} from '@material-ui/core';
import {
    Add,
    Lock,
    LockOpen,
} from '@material-ui/icons';
import { withStyles } from '@material-ui/core/styles';

const styles = theme => ({
    iconRoot: {
        color: theme.palette.secondary.main,
        width: '0.8em',
        margin: 0,
    },
});

const ChannelsList = ({
    classes, isOwner, teamName, teamId, username, channels, onAddChannel,
}) => {
    const channelsList = channels.map(ch => (
        <ListItem
            key={`channel-${ch.id}`}
            button
            component={Link}
            to={`/teams/${teamId}/${ch.id}`}
        >
            <ListItemIcon className={classes.iconRoot}>
                {ch.public ? <LockOpen /> : <Lock />}
            </ListItemIcon>
            <ListItemText
                inset
                primary={`# ${ch.name}`}
                primaryTypographyProps={{
                    color: 'inherit',
                }}
            />
        </ListItem>
    ));

    return (
        <React.Fragment>
            <List>
                <ListItem>
                    <ListItemText
                        primary={
                            teamName.charAt(0).toUpperCase()
                            + teamName.substr(1)
                        }
                        secondary={username}
                        primaryTypographyProps={{
                            color: 'inherit',
                            variant: 'headline',
                        }}
                        secondaryTypographyProps={{
                            color: 'secondary',
                            variant: 'body2',
                        }}
                    />
                </ListItem>
            </List>
            <Divider />
            <List
                subheader={(
                    <ListSubheader color="inherit">
                        <span>Channels</span>
                        {
                            isOwner && (
                                <ListItemSecondaryAction>
                                    <IconButton
                                        color="secondary"
                                        onClick={onAddChannel}
                                    >
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
        </React.Fragment >
    );
};

ChannelsList.propTypes = {
    classes: PropTypes.objectOf(PropTypes.string).isRequired,
    teamName: PropTypes.string.isRequired,
    username: PropTypes.string.isRequired,
    teamId: PropTypes.number.isRequired,
    isOwner: PropTypes.bool.isRequired,
    channels: PropTypes.arrayOf(PropTypes.shape({
        id: PropTypes.number.isRequired,
        name: PropTypes.string.isRequired,
        public: PropTypes.bool.isRequired,
    })).isRequired,
    onAddChannel: PropTypes.func.isRequired,
};

export default withStyles(styles)(ChannelsList);
