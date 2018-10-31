import React from 'react';
import PropTypes from 'prop-types';

import {
    List,
    Slide,
    Drawer,
    Hidden,
    SwipeableDrawer,
} from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';

import TeamsList from './TeamsList';
import TeamHeader from './TeamHeader';
import StarredList from './StarredList';
import MembersList from './MembersList';
import ChannelsList from './ChannelsList';

const iOS = process.browser && /iPad|iPhone|iPod/.test(navigator.userAgent);

const TEAM_DRAWER_WIDTH = 300;

const styles = theme => ({
    drawerPaper: {
        flexDirection: 'row',
        maxHeight: '100vh',
        height: '100vh',
        position: 'relative',
        border: 0,
    },
    drawerPaperMobile: {
        flexDirection: 'row',
    },
    teamDrawer: {
        width: TEAM_DRAWER_WIDTH,
        overflowY: 'auto',
        backgroundColor: theme.palette.primary.main,
        color: theme.palette.primary.contrastText,
    },
});

const SidebarContent = ({
    classes, teams, team, isOwner, isMobileOpen,
    searchText, channelId, ctxTeams, isFullTeamsOpen, isTeamMenuOpen,
    onChange, onUpdateCtxTeams, onMobileOpenToggle, onFullTeamsToggle,
    onSettingsToggle, onTeamMenuToggle, onNewChannelToggle,
    onInvitePeopleToggle, onTeamMembersToggle, onTeamDeleteToggle,
}) => {
    const drawerContent = (
        <React.Fragment>
            <Hidden only={isFullTeamsOpen ? null : 'xs'}>
                <TeamsList
                    teams={teams}
                    ctxTeams={ctxTeams}
                    searchText={searchText}
                    currentTeamId={team.id}
                    isFullOpen={isFullTeamsOpen}
                    onChange={onChange}
                    onSettingsToggle={onSettingsToggle}
                    onUpdateCtxTeams={onUpdateCtxTeams}
                    onFullTeamsToggle={onFullTeamsToggle}
                />
            </Hidden>
            <Hidden only={isFullTeamsOpen ? 'xs' : null}>
                <List
                    disablePadding
                    className={classes.teamDrawer}
                >
                    <TeamHeader
                        team={team}
                        isMenuOpen={isTeamMenuOpen}
                        onMenuToggle={onTeamMenuToggle}
                        onTeamsToggle={onFullTeamsToggle}
                        onDeleteToggle={onTeamDeleteToggle}
                    />
                    {
                        team.starredChannels.length > 0 && (
                            <StarredList
                                teamId={team.id}
                                channels={team.starredChannels}
                                channelId={channelId}
                            />
                        )
                    }
                    <ChannelsList
                        teamId={team.id}
                        channels={team.channels}
                        isOwner={isOwner}
                        onClick={onMobileOpenToggle}
                        onNewChannelToggle={onNewChannelToggle}
                        channelId={channelId}
                    />
                    <MembersList
                        teamId={team.id}
                        isOwner={isOwner}
                        users={team.directMessageMembers}
                        onInviteToggle={onInvitePeopleToggle}
                        onMembersToggle={onTeamMembersToggle}
                    />
                </List>
            </Hidden>

        </React.Fragment>
    );

    return (
        <React.Fragment>
            <Hidden mdUp>
                <SwipeableDrawer
                    anchor="left"
                    open={isMobileOpen}
                    onOpen={onMobileOpenToggle}
                    onClose={onMobileOpenToggle}
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
    ctxTeams: PropTypes.arrayOf(PropTypes.shape).isRequired,
    team: PropTypes.shape({
        id: PropTypes.number.isRequired,
        name: PropTypes.string.isRequired,
        admin: PropTypes.shape().isRequired,
        channels: PropTypes.arrayOf(PropTypes.shape).isRequired,
        starredChannels: PropTypes.arrayOf(PropTypes.shape).isRequired,
        directMessageMembers: PropTypes.arrayOf(PropTypes.shape).isRequired,
    }).isRequired,
    searchText: PropTypes.string.isRequired,
    channelId: PropTypes.number.isRequired,
    isOwner: PropTypes.bool.isRequired,
    isMobileOpen: PropTypes.bool.isRequired,
    isTeamMenuOpen: PropTypes.bool.isRequired,
    isFullTeamsOpen: PropTypes.bool.isRequired,
    onChange: PropTypes.func.isRequired,
    onUpdateCtxTeams: PropTypes.func.isRequired,
    onMobileOpenToggle: PropTypes.func.isRequired,
    onFullTeamsToggle: PropTypes.func.isRequired,
    onSettingsToggle: PropTypes.func.isRequired,
    onTeamMenuToggle: PropTypes.func.isRequired,
    onNewChannelToggle: PropTypes.func.isRequired,
    onInvitePeopleToggle: PropTypes.func.isRequired,
    onTeamMembersToggle: PropTypes.func.isRequired,
    onTeamDeleteToggle: PropTypes.func.isRequired,
};

export default withStyles(styles)(SidebarContent);
