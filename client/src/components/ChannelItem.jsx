import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

import {
    Chip,
    Icon,
    ListItem,
    ListItemText,
    ListItemIcon,
} from '@material-ui/core';
import {
    Lock,
    FiberManualRecord,
} from '@material-ui/icons';
import { withStyles } from '@material-ui/core/styles';

const styles = theme => ({
    listItem: {
        color: theme.palette.grey[400],
        paddingRight: theme.spacing.unit * 2,
    },
    icon: {
        margin: 0,
        color: 'inherit',
        fontFamily: 'Roboto',
    },
    chatIcon: {
        fontSize: '1em',
        color: theme.palette.primary.main,
        backgroundColor: theme.palette.grey[500],
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 4,
    },
    chip: {
        height: theme.spacing.unit * 3,
    },
    selected: {
        backgroundColor: `${theme.palette.primary.light}!important`,
    },
});

const ChannelItem = ({
    channel: {
        id, private: isPrivate, name, dm, updatesCount, online = false,
    }, classes, teamId, channelId, onClick,
}) => (
    <ListItem
        button
        component={Link}
        to={`/teams/${teamId}/${id}`}
        className={classes.listItem}
        classes={{ selected: classes.selected }}
        selected={channelId === id}
        onClick={onClick}
    >
        <ListItemIcon className={classes.icon}>
            <React.Fragment>
                {dm && (
                    name.split(',')[1]
                        ? (
                            <Icon
                                className={classes.chatIcon}
                                children={<small>{name.split(',').length}</small>}
                                fontSize="small"
                            />
                        ) : (
                            <FiberManualRecord
                                fontSize="small"
                                color={online ? 'secondary' : 'disabled'}
                            />
                        )
                )}
                {!dm && (
                    isPrivate
                        ? <Lock fontSize="small" />
                        : (
                            <Icon
                                children="#"
                                fontSize="small"
                            />
                        )
                )}
            </React.Fragment>
        </ListItemIcon>
        <ListItemText
            primary={name}
            primaryTypographyProps={{
                color: 'inherit',
            }}
        />
        {
            updatesCount > 0 && (
                <Chip
                    label={updatesCount}
                    color="secondary"
                    className={classes.chip}
                />
            )
        }
    </ListItem>
);

ChannelItem.propTypes = {
    classes: PropTypes.objectOf(PropTypes.string).isRequired,
    teamId: PropTypes.number.isRequired,
    channelId: PropTypes.number.isRequired,
    channel: PropTypes.shape({
        id: PropTypes.number.isRequired,
        name: PropTypes.string.isRequired,
        private: PropTypes.bool.isRequired,
        dm: PropTypes.bool.isRequired,
        updatesCount: PropTypes.number.isRequired,
    }).isRequired,
    onClick: PropTypes.func.isRequired,
};

export default withStyles(styles)(ChannelItem);
