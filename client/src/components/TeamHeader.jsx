import React from 'react';
import PropTypes from 'prop-types';

import {
    List,
    Hidden,
    Collapse,
    ListItem,
    IconButton,
    ListItemText,
    ListItemIcon,
    ListItemSecondaryAction,
} from '@material-ui/core';
import {
    Apps,
    ArrowDropUp,
    ArrowDropDown,
    FiberManualRecord,
} from '@material-ui/icons';
import { withStyles } from '@material-ui/core/styles';

const styles = theme => ({
    greyColor: {
        color: theme.palette.grey[400],
    },
    flex: {
        display: 'flex',
        alignItems: 'center',
    },
    icon: {
        margin: 0,
    },
    dense: {
        paddingTop: 0,
    },
});

const TeamHeader = ({
    team: {
        name, description, membersCount, admin: { username, online },
    }, classes, isMenuOpen, onMenuToggle, onTeamsToggle,
    onUpdateToggle, onDeleteToggle, onInfoToggle,
}) => {
    const teamMenu = (
        <Collapse in={isMenuOpen}>
            <List>
                <ListItem>
                    <ListItemText
                        secondary={`
                        ${membersCount} members -
                        ${description || 'no description'}
                        `}
                        secondaryTypographyProps={{
                            className: classes.greyColor,
                        }}
                    />
                </ListItem>
                <ListItem
                    button
                    onClick={onUpdateToggle}
                >
                    <ListItemText
                        primary="Update Team"
                        primaryTypographyProps={{
                            className: classes.greyColor,
                        }}
                    />
                </ListItem>
                <ListItem
                    button
                    onClick={onDeleteToggle}
                >
                    <ListItemText
                        primary="Delete Team"
                        primaryTypographyProps={{
                            className: classes.greyColor,
                        }}
                    />
                </ListItem>
                <ListItem
                    button
                    onClick={onInfoToggle}
                >
                    <ListItemText
                        primary="About Team"
                        primaryTypographyProps={{
                            className: classes.greyColor,
                        }}
                    />
                </ListItem>
            </List>
        </Collapse>
    );
    return (
        <List>
            <ListItem button>
                <ListItemText
                    primary={(
                        <React.Fragment>
                            {name.charAt(0).toUpperCase() + name.substr(1)}
                            <Hidden smUp>
                                {isMenuOpen ? <ArrowDropUp /> : <ArrowDropDown />}
                            </Hidden>
                        </React.Fragment>
                    )}
                    primaryTypographyProps={{
                        variant: 'h5',
                        color: 'inherit',
                        noWrap: true,
                        className: classes.flex,
                    }}
                    onClick={onMenuToggle}
                />
                <ListItemSecondaryAction>
                    <Hidden only="xs">
                        <IconButton
                            color="inherit"
                            onClick={onMenuToggle}
                        >
                            {isMenuOpen ? <ArrowDropUp /> : <ArrowDropDown />}
                        </IconButton>
                    </Hidden>
                    <Hidden smUp>
                        <IconButton
                            color="inherit"
                            onClick={onTeamsToggle}
                        >
                            <Apps />
                        </IconButton>
                    </Hidden>
                </ListItemSecondaryAction>
            </ListItem>
            <ListItem className={classes.dense}>
                <ListItemIcon className={classes.icon}>
                    <FiberManualRecord
                        fontSize="small"
                        color={online ? 'secondary' : 'disabled'}
                    />
                </ListItemIcon>
                <ListItemText
                    secondary={username}
                    secondaryTypographyProps={{
                        color: 'inherit',
                    }}
                />
            </ListItem>
            {teamMenu}
        </List>
    );
};

TeamHeader.propTypes = {
    classes: PropTypes.objectOf(PropTypes.string).isRequired,
    team: PropTypes.shape({
        name: PropTypes.string.isRequired,
        description: PropTypes.any,
        membersCount: PropTypes.number.isRequired,
        admin: PropTypes.shape({
            username: PropTypes.string.isRequired,
            online: PropTypes.bool.isRequired,
        }).isRequired,
    }).isRequired,
    isMenuOpen: PropTypes.bool.isRequired,
    onMenuToggle: PropTypes.func.isRequired,
    onTeamsToggle: PropTypes.func.isRequired,
    onUpdateToggle: PropTypes.func.isRequired,
    onDeleteToggle: PropTypes.func.isRequired,
    onInfoToggle: PropTypes.func.isRequired,
};

export default withStyles(styles)(TeamHeader);
