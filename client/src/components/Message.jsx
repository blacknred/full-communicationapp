/* eslint-disable camelcase */

import React from 'react';
import moment from 'moment';
import PropTypes from 'prop-types';

import {
    Slide,
    Avatar,
    Hidden,
    ListItem,
    Typography,
    ListItemText,
    ListItemSecondaryAction,
} from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';

const styles = {
    avatar: {
        alignSelf: 'baseline',
    },
};

const Message = ({
    classes, text, created_at, sender: { username, avatar },
}) => (
    <Slide in direction="up">
        <ListItem>
            {
                avatar
                    ? (
                        <Avatar
                            src={avatar}
                            className={classes.avatar}
                        />
                    ) : (
                        <Avatar className={classes.avatar}>
                            {username.charAt(0).toUpperCase()}
                        </Avatar>
                    )
            }
            <ListItemText
                primary={text}
                secondary={(
                    <React.Fragment>
                        {username}
                        <Hidden smDown>
                            {`${moment.unix(created_at / 1000).fromNow(true)} ago`}
                        </Hidden>
                    </React.Fragment>
                )}
            />
            <Hidden mdUp>
                <ListItemSecondaryAction>
                    <Typography variant="caption">
                        {moment.unix(created_at / 1000).fromNow(true)}
                    </Typography>
                </ListItemSecondaryAction>
            </Hidden>
        </ListItem>
    </Slide>
);

Message.propTypes = {
    classes: PropTypes.objectOf(PropTypes.string).isRequired,
    text: PropTypes.string.isRequired,
    created_at: PropTypes.string.isRequired,
    sender: PropTypes.shape({
        username: PropTypes.string.isRequired,
    }).isRequired,
};

export default withStyles(styles)(Message);
