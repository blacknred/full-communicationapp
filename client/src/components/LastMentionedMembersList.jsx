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
} from '@material-ui/core';
import {
    AddCircleOutline,
    RadioButtonChecked,
    RadioButtonUnchecked,
} from '@material-ui/icons';
import { withStyles } from '@material-ui/core/styles';

const styles = theme => ({
    iconRoot: {
        color: theme.palette.secondary.main,
        margin: 0,
    },
    subheader: {
        display: 'flex',
        justifyContent: 'space-between',
        paddingRight: theme.spacing.unit,
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
                {
                    user.online
                        ? <RadioButtonChecked fontSize="small" />
                        : <RadioButtonUnchecked fontSize="small" />
                }
            </ListItemIcon>
            <ListItemText
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
            subheader={(
                <ListSubheader
                    color="inherit"
                    className={classes.subheader}
                >
                    {`DIRECT CHATS (${users.length})`}
                    <Tooltip title="Find Member">
                        <IconButton
                            color="inherit"
                            onClick={() => onToggle('isSearchTeamMembersModalOpen')}
                        >
                            <AddCircleOutline />
                        </IconButton>
                    </Tooltip>
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
        online: PropTypes.bool.isRequired,
    })).isRequired,
    onToggle: PropTypes.func.isRequired,
};

export default withStyles(styles)(LastMentionedMembersList);
