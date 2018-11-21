import React from 'react';
import PropTypes from 'prop-types';
import { compose } from 'recompose';
import { Link } from 'react-router-dom';

import {
    List,
    Input,
    Badge,
    Avatar,
    Divider,
    Tooltip,
    ListItem,
    ListItemText,
    InputAdornment,
} from '@material-ui/core';
import {
    Add,
    Search,
    Settings,
    Fullscreen,
    FullscreenExit,
} from '@material-ui/icons';
import { withStyles } from '@material-ui/core/styles';
import withWidth, { isWidthDown } from '@material-ui/core/withWidth';

const DRAWER_MAX_WIDTH = 230;

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
    button: {
        backgroundColor: theme.palette.primary.main,
        color: 'inherit',
    },
    badge: {
        margin: 5,
    },
    selected: {
        backgroundColor: `${theme.palette.primary.main}!important`,
    },
    search: {
        width: '100%',
        color: theme.palette.primary.contrastText,
    },
});

const TeamsList = ({
    classes, width, teams, ctxTeams, teamId, searchText, isFullOpen,
    onChange, onFullToggle, onSettingsToggle,
}) => {
    const teamsSearch = (
        <ListItem>
            <Input
                autoFocus
                disableUnderline
                id="teams-search"
                type="text"
                name="searchText"
                value={searchText}
                placeholder="Search..."
                className={classes.search}
                onChange={onChange}
                startAdornment={(
                    <InputAdornment position="start">
                        <Search color="inherit" />
                    </InputAdornment>
                )}
            />
            <Divider />
        </ListItem>
    );
    const teamsList = (isFullOpen ? teams : ctxTeams)
        .map(({ id, name, updatesCount }) => (
            <ListItem
                button
                component={Link}
                key={`team-${id}`}
                to={`/teams/${id}`}
                selected={id === teamId}
                classes={{ selected: classes.selected }}
                onClick={() => {
                    if (isFullOpen && isWidthDown('sm', width)) {
                        onFullToggle();
                    }
                }}
            >
                {
                    updatesCount > 0
                        ? (
                            <Badge
                                classes={{ badge: classes.badge }}
                                badgeContent={updatesCount}
                                color="secondary"
                                children={(
                                    <Avatar className={classes.button}>
                                        {name.charAt(0).toUpperCase()}
                                    </Avatar>
                                )}
                            />
                        ) : (
                            <Avatar className={classes.button}>
                                {name.charAt(0).toUpperCase()}
                            </Avatar>
                        )
                }
                {
                    isFullOpen && (
                        <ListItemText
                            primary={
                                name.charAt(0).toUpperCase() + name.substr(1)
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
                {isFullOpen && teamsSearch}
                {teamsList}
                <ListItem
                    key="link-newteam"
                    button
                    component={Link}
                    to="/new"
                >
                    <Tooltip title="Create new team">
                        <Avatar className={classes.button}>
                            <Add color="secondary" />
                        </Avatar>
                    </Tooltip>
                    {
                        isFullOpen && (
                            <ListItemText
                                primary="New team"
                                primaryTypographyProps={{
                                    color: 'inherit',
                                }}
                            />
                        )
                    }
                </ListItem>
            </List>
            <List disablePadding>
                <ListItem
                    button
                    key="expand-teams-list"
                    onClick={onFullToggle}
                >
                    <Tooltip title={isFullOpen ? 'Decreese panel' : 'Enlarge panel'}>
                        <Avatar className={classes.button}>
                            {
                                isFullOpen
                                    ? <FullscreenExit />
                                    : <Fullscreen />
                            }
                        </Avatar>
                    </Tooltip>
                    {
                        isFullOpen && (
                            <ListItemText
                                primary="Hide panel"
                                primaryTypographyProps={{
                                    color: 'inherit',
                                }}
                            />
                        )
                    }
                </ListItem>
                <ListItem
                    button
                    key="link-settings"
                    onClick={onSettingsToggle}
                >
                    <Tooltip title="Settings">
                        <Avatar className={classes.button}>
                            <Settings />
                        </Avatar>
                    </Tooltip>
                    {
                        isFullOpen && (
                            <ListItemText
                                primary="Settings"
                                primaryTypographyProps={{
                                    color: 'inherit',
                                }}
                            />
                        )
                    }
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
        updatesCount: PropTypes.number.isRequired,
    })).isRequired,
    ctxTeams: PropTypes.arrayOf(PropTypes.shape({
        id: PropTypes.number.isRequired,
        name: PropTypes.string.isRequired,
        updatesCount: PropTypes.number.isRequired,
    })).isRequired,
    searchText: PropTypes.string.isRequired,
    teamId: PropTypes.number.isRequired,
    isFullOpen: PropTypes.bool.isRequired,
    onChange: PropTypes.func.isRequired,
    onFullToggle: PropTypes.func.isRequired,
    onSettingsToggle: PropTypes.func.isRequired,
};

export default compose(withStyles(styles), withWidth())(TeamsList);
