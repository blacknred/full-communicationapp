/* eslint-disable camelcase */

import React from 'react';
import moment from 'moment';
import PropTypes from 'prop-types';

import {
    List,
    Avatar,
    ListItem,
    ListItemText,
    ListItemSecondaryAction,
} from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';

const styles = theme => ({
    toolbar: theme.mixins.toolbar,
    content: {
        flexGrow: 1,
        backgroundColor: theme.palette.background.default,
        padding: `${theme.spacing.unit * 12}px ${theme.spacing.unit * 3}px`,
        paddingBottom: 100,
        overflowX: 'auto',
        height: '100%',
    },
});

const MessagesList = ({ classes, messages }) => {
    const messagesList = messages.map(({
        id, text, created_at, user: { username, avatar },
    }) => (
        <ListItem key={`msg-${id}`}>
            {
                avatar
                    ? <Avatar src={avatar} />
                    : (
                        <Avatar>
                            {username.charAt(0).toUpperCase()}
                        </Avatar>
                    )
            }
            <ListItemText
                primary={text}
                secondary={username}
            // primaryTypographyProps={{
            //     color: 'inherit',
            //     variant: 'body2',
            // }}
            />
            <ListItemSecondaryAction>
                {moment.unix(created_at / 1000).fromNow(true)}
            </ListItemSecondaryAction>
        </ListItem>
    ));

    return (
        <List className={classes.content}>
            {/* <div className={classes.toolbar} /> */}
            {messagesList}
        </List>
    );
};

MessagesList.propTypes = {
    classes: PropTypes.objectOf(PropTypes.string).isRequired,
    messages: PropTypes.arrayOf(PropTypes.shape({
        id: PropTypes.number.isRequired,
        text: PropTypes.string.isRequired,
        created_at: PropTypes.string.isRequired,
        user: PropTypes.shape({
            username: PropTypes.string.isRequired,
        }).isRequired,
    })).isRequired,
};

export default withStyles(styles)(MessagesList);
