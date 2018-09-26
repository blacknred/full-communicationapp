import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

import {
    List,
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
        width: '0.8em',
        margin: 0,
    },
});

const LastMentionedMembersList = ({
    classes, isOwner, teamId, users, onSearchMember, onInvitePeople,
}) => {
    const membersList = users.map(user => (
        <ListItem
            key={`channel-member-${user.id}`}
            button
            component={Link}
            to={`/teams/${teamId}/user/${user.id}`}
        >
            <ListItemIcon className={classes.iconRoot}>
                <FiberManualRecord />
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
            dense
            subheader={(
                <ListSubheader color="inherit">
                    <span>Direct Chats</span>
                    <ListItemSecondaryAction>
                        <IconButton
                            color="secondary"
                            onClick={onSearchMember}
                        >
                            <OpenInNew />
                        </IconButton>
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
    );
};

LastMentionedMembersList.propTypes = {
    classes: PropTypes.objectOf(PropTypes.string).isRequired,
    teamId: PropTypes.number.isRequired,
    isOwner: PropTypes.bool.isRequired,
    users: PropTypes.arrayOf(PropTypes.shape({
        id: PropTypes.number.isRequired,
        name: PropTypes.string.isRequired,
    })).isRequired,
    onSearchMember: PropTypes.func.isRequired,
    onInvitePeople: PropTypes.func.isRequired,
};

export default withStyles(styles)(LastMentionedMembersList);
