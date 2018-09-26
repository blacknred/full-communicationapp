import React from 'react';
import PropTypes from 'prop-types';

import {
    Drawer,
    Hidden,
    SwipeableDrawer,
} from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';

import TeamsList from './TeamsList';
import ChannelsList from './ChannelsList';
import LastMentionedMembersList from './LastMentionedMembersList';

const iOS = process.browser && /iPad|iPhone|iPod/.test(navigator.userAgent);

const ACTIONS_DRAWER_WIDTH = 260;

const styles = theme => ({
    drawerPaper: {
        position: 'relative',
        flexDirection: 'row',
        minHeight: '100vh',
        height: '100%',
        border: 0,
    },
    drawerPaperMobile: {
        // width: '90%',
    },
    actionsDrawer: {
        minWidth: ACTIONS_DRAWER_WIDTH,
        overflowY: 'auto',
        backgroundColor: theme.palette.primary.main,
        color: theme.palette.primary.contrastText,
    },
});

const SidebarContent = ({
    classes, teams, team, username, isOpen,
    isFullTeamsModeOpen, onToggleFullTeamsMode,
    onAddChannel, onInvitePeople, onToggleSidebar, onSearchMember,
}) => {
    const drawerContent = (
        <React.Fragment>
            <TeamsList
                teams={teams}
                currentTeamId={team.id}
                isFullModeOpen={isFullTeamsModeOpen}
                onToggleFullMode={onToggleFullTeamsMode}
            />
            <div className={classes.actionsDrawer}>
                <ChannelsList
                    teamName={team.name}
                    teamId={team.id}
                    username={username}
                    channels={team.channels}
                    isOwner={team.admin}
                    onAddChannel={onAddChannel}
                />
                <LastMentionedMembersList
                    teamId={team.id}
                    isOwner={team.admin}
                    users={team.directMessageMembers}
                    onInvitePeople={onInvitePeople}
                    onSearchMember={onSearchMember}
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
                    onOpen={onToggleSidebar}
                    onClose={onToggleSidebar}
                    classes={{ paper: classes.drawerPaper }}
                    disableBackdropTransition={!iOS}
                    disableDiscovery={iOS}
                >
                    {drawerContent}
                </SwipeableDrawer>
            </Hidden>
            <Hidden smDown implementation="css">
                <Drawer
                    variant="permanent"
                    anchor="left"
                    classes={{ paper: classes.drawerPaper }}
                >
                    {drawerContent}
                </Drawer>
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
        admin: PropTypes.bool.isRequired,
        channels: PropTypes.arrayOf(PropTypes.shape).isRequired,
        directMessageMembers: PropTypes.arrayOf(PropTypes.shape).isRequired,
    }).isRequired,
    username: PropTypes.string.isRequired,
    isOpen: PropTypes.bool.isRequired,
    isFullTeamsModeOpen: PropTypes.bool.isRequired,
    onAddChannel: PropTypes.func.isRequired,
    onInvitePeople: PropTypes.func.isRequired,
    onSearchMember: PropTypes.func.isRequired,
    onToggleSidebar: PropTypes.func.isRequired,
    onToggleFullTeamsMode: PropTypes.func.isRequired,
};

export default withStyles(styles)(SidebarContent);
