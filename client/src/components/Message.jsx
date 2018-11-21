/* eslint-disable camelcase */

import React from 'react';
import moment from 'moment';
import PropTypes from 'prop-types';

import {
    Chip,
    Slide,
    Avatar,
    Hidden,
    ListItem,
    Typography,
    ListItemText,
    ListItemSecondaryAction,
} from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';

const styles = theme => ({
    avatar: {
        alignSelf: 'baseline',
    },
    chip: {
        margin: theme.spacing.unit,
    },
    announce: {
        justifyContent: 'center',
        padding: 0,
    },
});

const Message = ({
    classes, text, created_at, announcement, isOwner,
    sender: { username, avatar },
}) => (
    <Slide in direction="up">
        <ListItem className={announcement ? classes.announce : null}>
            {
                announcement ? (
                    <Chip
                        label={text}
                        className={classes.chip}
                    />
                ) : (
                    <React.Fragment>
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
                                        {`${moment.unix(created_at / 1000)
                                            .fromNow(true)} ago`}
                                    </Hidden>
                                    {isOwner && 'options'}
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
                    </React.Fragment>
                )
            }
        </ListItem>
    </Slide>
);

Message.propTypes = {
    classes: PropTypes.objectOf(PropTypes.string).isRequired,
    text: PropTypes.string.isRequired,
    announcement: PropTypes.bool.isRequired,
    created_at: PropTypes.string.isRequired,
    sender: PropTypes.shape({
        username: PropTypes.string.isRequired,
    }).isRequired,
    isOwner: PropTypes.bool.isRequired,
};

export default withStyles(styles)(Message);
