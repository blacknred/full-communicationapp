import React from 'react';
import PropTypes from 'prop-types';
import { compose } from 'recompose';
import { Link } from 'react-router-dom';

import {
    List,
    Avatar,
    ListItem,
    ListItemText,
} from '@material-ui/core';
import {
    Add,
    Settings,
    Fullscreen,
    FullscreenExit,
} from '@material-ui/icons';
import { withStyles } from '@material-ui/core/styles';
import withWidth, { isWidthDown } from '@material-ui/core/withWidth';

const DRAWER_MAX_WIDTH = 250;

const styles = theme => ({
    root: {
        maxWidth: DRAWER_MAX_WIDTH,
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        backgroundColor: theme.palette.primary.dark,
        color: theme.palette.primary.contrastText,
        justifyContent: 'space-between',
    },
    list: {
        overflowY: 'auto',
    },
    avatar: {
        backgroundColor: theme.palette.primary.main,
    },
    selected: {
        backgroundColor: `${theme.palette.primary.main}!important`,
    },
});

const TeamsList = ({
    classes, width, teams, currentTeamId, isFullModeOpen, onToggle,
}) => {
    const teamsList = teams.map(({ id, name }) => (
        <ListItem
            button
            component={Link}
            key={`team-${id}`}
            to={`/teams/${id}`}
            selected={id === currentTeamId}
            classes={{ selected: classes.selected }}
            onClick={() => (
                isWidthDown('sm', width)
                && isFullModeOpen
                && onToggle('isFullTeamsModeOpen')
            )}
        >
            <Avatar className={classes.avatar}>
                {name.charAt(0).toUpperCase()}
            </Avatar>
            {
                isFullModeOpen && (
                    <ListItemText
                        primary={
                            name.charAt(0).toUpperCase()
                            + name.substr(1)
                        }
                        primaryTypographyProps={{
                            color: 'inherit',
                            noWrap: true,
                        }}
                    />
                )
            }
        </ListItem>
    ));

    return (
        <div className={classes.root}>
            <List
                disablePadding
                className={classes.list}
            >
                {teamsList}
                <ListItem
                    key="link-newteam"
                    button
                    component={Link}
                    to="/new-team"
                >
                    <Avatar className={classes.avatar}>
                        <Add color="secondary" />
                    </Avatar>
                    {
                        isFullModeOpen && (
                            <ListItemText
                                primary="New team"
                                primaryTypographyProps={{
                                    color: 'inherit',
                                    noWrap: true,
                                }}
                            />
                        )
                    }

                </ListItem>
            </List>
            <List>
                <ListItem
                    button
                    key="expand-teams-list"
                    onClick={() => onToggle('isFullTeamsModeOpen')}
                >
                    <Avatar className={classes.avatar}>
                        {isFullModeOpen ? <FullscreenExit /> : <Fullscreen />}
                    </Avatar>
                </ListItem>
                <ListItem
                    key="link-settings"
                    button
                    component={Link}
                    to="/settings"
                >
                    <Avatar className={classes.avatar}>
                        <Settings />
                    </Avatar>
                </ListItem>
            </List>
        </div>
    );
};

TeamsList.propTypes = {
    classes: PropTypes.objectOf(PropTypes.string).isRequired,
    width: PropTypes.string.isRequired,
    teams: PropTypes.arrayOf(PropTypes.shape({
        id: PropTypes.number.isRequired,
        name: PropTypes.string.isRequired,
    })).isRequired,
    currentTeamId: PropTypes.number.isRequired,
    isFullModeOpen: PropTypes.bool.isRequired,
    onToggle: PropTypes.func.isRequired,
};

export default compose(withStyles(styles), withWidth())(TeamsList);
