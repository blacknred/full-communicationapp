import React from 'react';
import PropTypes from 'prop-types';

import {
    List,
    Tooltip,
    ListItem,
    IconButton,
    ListItemIcon,
    ListItemText,
    ListSubheader,
} from '@material-ui/core';
import {
    Star,
    ExpandLess,
    ExpandMore,
    AddCircleOutline,
} from '@material-ui/icons';
import { withStyles } from '@material-ui/core/styles';

import ChannelItem from './ChannelItem';

const MIN_LIST = 4;

const styles = theme => ({
    icon: {
        color: theme.palette.grey[400],
        margin: 0,
    },
    subheader: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingRight: theme.spacing.unit,
    },
    wider: {
        flex: 1,
    },
});

const ChannelsList = ({
    classes, teamId, channelId, channels, starred, chats,
    isOwner, isAllChannelsOpen, isAllChatsOpen, isAllStarredOpen,
    onClick, onNewToggle, onNewDmToggle, onInviteToggle,
    onAllChatsOpen, onAllChannelsOpen, onAllStarredOpen,
}) => (
    <List>
        {/* starred */}
        {
            starred.length > 0 && (
                <React.Fragment>
                    <ListSubheader
                        color="inherit"
                        className={classes.subheader}
                    >
                        <Star fontSize="small" /> &nbsp;
                        <span className={classes.wider}>
                            {`STARRED (${starred.length})`}
                        </span>
                    </ListSubheader>
                    {
                        starred.map((ch, index) => (
                            (!isAllStarredOpen ? index < MIN_LIST : true) && (
                                <ChannelItem
                                    channel={ch}
                                    teamId={teamId}
                                    onClick={onClick}
                                    channelId={channelId}
                                    key={`channel-${ch.id}`}
                                />
                            )
                        ))
                    }
                    {
                        (starred.length > MIN_LIST) && (
                            <ListItem
                                button
                                onClick={onAllStarredOpen}
                                className={classes.icon}
                            >
                                <ListItemIcon
                                    fontSize="small"
                                    className={classes.icon}
                                >
                                    {isAllStarredOpen ? <ExpandLess /> : <ExpandMore />}
                                </ListItemIcon>
                                <ListItemText
                                    primary={isAllStarredOpen ? 'less' : 'more'}
                                    primaryTypographyProps={{
                                        color: 'inherit',
                                    }}
                                />
                            </ListItem>
                        )
                    }
                    <ListItem />
                </React.Fragment>
            )
        }

        {/* channels */}
        <ListSubheader
            color="inherit"
            className={classes.subheader}
        >
            {`CHANNELS (${channels.length})`}
            {
                isOwner && (
                    <Tooltip title="Add new channel">
                        <IconButton
                            className={classes.icon}
                            onClick={onNewToggle}
                        >
                            <AddCircleOutline />
                        </IconButton>
                    </Tooltip>
                )
            }
        </ListSubheader>
        {
            channels.map((ch, index) => (
                (!isAllChannelsOpen ? index < MIN_LIST : true) && (
                    <ChannelItem
                        channel={ch}
                        teamId={teamId}
                        onClick={onClick}
                        channelId={channelId}
                        key={`channel-${ch.id}`}
                    />
                )
            ))
        }
        {
            (channels.length > MIN_LIST) && (
                <ListItem
                    button
                    onClick={onAllChannelsOpen}
                    className={classes.icon}
                >
                    <ListItemIcon
                        fontSize="small"
                        className={classes.icon}
                    >
                        {isAllChannelsOpen ? <ExpandLess /> : <ExpandMore />}
                    </ListItemIcon>
                    <ListItemText
                        primary={isAllChannelsOpen ? 'less' : 'more'}
                        primaryTypographyProps={{
                            color: 'inherit',
                        }}
                    />
                </ListItem>
            )
        }
        <ListItem dense />

        {/* chats */}
        <ListSubheader
            color="inherit"
            className={classes.subheader}
        >
            {`DIRECT CHATS (${chats.length})`}
            <Tooltip title="New chat">
                <IconButton
                    className={classes.icon}
                    onClick={onNewDmToggle}
                >
                    <AddCircleOutline />
                </IconButton>
            </Tooltip>
        </ListSubheader>
        {
            chats.map((ch, index) => (
                (!isAllChatsOpen ? index < MIN_LIST : true) && (
                    <ChannelItem
                        channel={ch}
                        teamId={teamId}
                        onClick={onClick}
                        channelId={channelId}
                        key={`channel-${ch.id}`}
                    />
                )
            ))
        }
        {
            (chats.length > MIN_LIST) && (
                <ListItem
                    button
                    onClick={onAllChatsOpen}
                    className={classes.icon}
                >
                    <ListItemIcon
                        fontSize="small"
                        className={classes.icon}
                    >
                        {isAllChatsOpen ? <ExpandLess /> : <ExpandMore />}
                    </ListItemIcon>
                    <ListItemText
                        primary={isAllChatsOpen ? 'less' : 'more'}
                        primaryTypographyProps={{
                            color: 'inherit',
                        }}
                    />
                </ListItem>
            )
        }

        {/* add new member */}
        {
            isOwner && (
                <ListItem
                    key="invite-people"
                    button
                    color="secondary"
                    onClick={onInviteToggle}
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
);

ChannelsList.propTypes = {
    classes: PropTypes.objectOf(PropTypes.string).isRequired,
    teamId: PropTypes.number.isRequired,
    isOwner: PropTypes.bool.isRequired,
    isAllChatsOpen: PropTypes.bool.isRequired,
    isAllChannelsOpen: PropTypes.bool.isRequired,
    isAllStarredOpen: PropTypes.bool.isRequired,
    channelId: PropTypes.number.isRequired,
    channels: PropTypes.arrayOf(PropTypes.shape()).isRequired,
    starred: PropTypes.arrayOf(PropTypes.shape()).isRequired,
    chats: PropTypes.arrayOf(PropTypes.shape()).isRequired,
    onClick: PropTypes.func.isRequired,
    onNewToggle: PropTypes.func.isRequired,
    onInviteToggle: PropTypes.func.isRequired,
    onNewDmToggle: PropTypes.func.isRequired,
    onAllChatsOpen: PropTypes.func.isRequired,
    onAllChannelsOpen: PropTypes.func.isRequired,
    onAllStarredOpen: PropTypes.func.isRequired,
};

export default withStyles(styles)(ChannelsList);
