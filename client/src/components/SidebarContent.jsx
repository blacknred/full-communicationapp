import React from 'react';
import PropTypes from 'prop-types';

import {
    Slide,
    Drawer,
    Hidden,
    SwipeableDrawer,
} from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';

import TeamsList from './TeamsList';
import TeamHeader from './TeamHeader';
import ChannelsList from './ChannelsList';
import LastMentionedMembersList from './LastMentionedMembersList';

const iOS = process.browser && /iPad|iPhone|iPod/.test(navigator.userAgent);

const ACTIONS_DRAWER_WIDTH = 260;

const styles = theme => ({
    drawerPaper: {
        flexDirection: 'row',
        minHeight: '100vh',
        height: '100%',
        position: 'relative',
        border: 0,
        '&>div:last-of-type': {
            width: ACTIONS_DRAWER_WIDTH,
        },
    },
    drawerPaperMobile: {
        minWidth: '100vw',
        flexDirection: 'row',
        '&>div:last-of-type': {
            minWidth: ACTIONS_DRAWER_WIDTH,
            width: '100%',
        },
    },
    actionsDrawer: {
        overflowY: 'auto',
        backgroundColor: theme.palette.primary.main,
        color: theme.palette.primary.contrastText,
    },
});

const SidebarContent = ({
    classes, teams, team, isOwner, isOpen, isFullTeamsModeOpen, onToggle,
}) => {
    const drawerContent = (
        <React.Fragment>
            <TeamsList
                teams={teams}
                currentTeamId={team.id}
                isFullModeOpen={isFullTeamsModeOpen}
                onToggle={onToggle}
            />
            { /* eslint-disable */}
            <div
                className={classes.actionsDrawer}
                onClick={() => onToggle('isSidebarOpen')}
                role="navigation"
            >
                { /* eslint-enable */}
                <TeamHeader
                    teamId={team.id}
                    teamName={team.name}
                    admin={team.admin}
                />
                <ChannelsList
                    teamId={team.id}
                    channels={team.channels}
                    isOwner={isOwner}
                    onToggle={onToggle}
                />
                <LastMentionedMembersList
                    teamId={team.id}
                    isOwner={isOwner}
                    users={team.directMessageMembers}
                    onToggle={onToggle}
                />
            </div>
        </React.Fragment>
    );

    return (
        <React.Fragment>
            <Hidden mdUp>
                <SwipeableDrawer
                    anchor="left"
                    open={isOpen}
                    onOpen={() => onToggle('isSidebarOpen')}
                    onClose={() => onToggle('isSidebarOpen')}
                    classes={{ paper: classes.drawerPaperMobile }}
                    disableBackdropTransition={!iOS}
                    disableDiscovery={iOS}
                >
                    {drawerContent}
                </SwipeableDrawer>
            </Hidden>
            <Hidden smDown implementation="css">
                <Slide in direction="right">
                    <Drawer
                        variant="permanent"
                        anchor="left"
                        classes={{ paper: classes.drawerPaper }}
                    >
                        {drawerContent}
                    </Drawer>
                </Slide>
            </Hidden>
        </React.Fragment>
    );
};

SidebarContent.propTypes = {
    classes: PropTypes.objectOf(PropTypes.string).isRequired,
    teams: PropTypes.arrayOf(PropTypes.shape).isRequired,
    team: PropTypes.shape({
        id: PropTypes.number.isRequired,
        name: PropTypes.string.isRequired,
        admin: PropTypes.shape().isRequired,
        channels: PropTypes.arrayOf(PropTypes.shape).isRequired,
        directMessageMembers: PropTypes.arrayOf(PropTypes.shape).isRequired,
    }).isRequired,
    isOwner: PropTypes.bool.isRequired,
    isOpen: PropTypes.bool.isRequired,
    isFullTeamsModeOpen: PropTypes.bool.isRequired,
    onToggle: PropTypes.func.isRequired,
};

export default withStyles(styles)(SidebarContent);
