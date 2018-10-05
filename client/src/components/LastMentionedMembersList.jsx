import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

import {
    List,
    Tooltip,
    ListItem,
    IconButton,
    ListItemText,
    ListItemIcon,
    ListSubheader,
    ListItemSecondaryAction,
} from '@material-ui/core';
import {
    OpenInNew,
    FiberManualRecord,
} from '@material-ui/icons';
import { withStyles } from '@material-ui/core/styles';

const styles = theme => ({
    iconRoot: {
        color: theme.palette.secondary.main,
        margin: 0,
    },
});

const LastMentionedMembersList = ({
    classes, isOwner, teamId, users, onToggle,
}) => {
    const membersList = users.map(user => (
        <ListItem
            key={`channel-member-${user.id}`}
            button
            component={Link}
            to={`/teams/${teamId}/user/${user.id}`}
        >
            <ListItemIcon className={classes.iconRoot}>
                <FiberManualRecord fontSize="small" />
            </ListItemIcon>
            <ListItemText
                inset
                primary={user.username}
                primaryTypographyProps={{
                    color: 'inherit',
                    variant: 'body2',
                }}
            />
        </ListItem>
    ));

    return (
        <List
            // dense
            subheader={(
                <ListSubheader color="inherit">
                    <span>Direct Chats</span>
                    <ListItemSecondaryAction>
                        <Tooltip title="Find Member">
                            <IconButton
                                color="secondary"
                                onClick={() => onToggle('isSearchTeamMembersModalOpen')}
                            >
                                <OpenInNew />
                            </IconButton>
                        </Tooltip>
                    </ListItemSecondaryAction>
                </ListSubheader>
            )}
        >
            {membersList}
            {
                isOwner && (
                    <ListItem
                        key="invite-people"
                        button
                        color="secondary"
                        onClick={() => onToggle('isInvitePeopleModalOpen')}
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
};

LastMentionedMembersList.propTypes = {
    classes: PropTypes.objectOf(PropTypes.string).isRequired,
    teamId: PropTypes.number.isRequired,
    isOwner: PropTypes.bool.isRequired,
    users: PropTypes.arrayOf(PropTypes.shape({
        id: PropTypes.number.isRequired,
        username: PropTypes.string.isRequired,
    })).isRequired,
    onToggle: PropTypes.func.isRequired,
};

export default withStyles(styles)(LastMentionedMembersList);
