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
import StarredList from './StarredList';
import ChannelsList from './ChannelsList';
import LastMentionedMembersList from './LastMentionedMembersList';

const iOS = process.browser && /iPad|iPhone|iPod/.test(navigator.userAgent);

const TEAM_DRAWER_WIDTH = 310;

const styles = theme => ({
    drawerPaper: {
        flexDirection: 'row',
        maxHeight: '100vh',
        height: '100vh',
        overflow: 'hidden',
        position: 'relative',
        border: 0,
        '&>div:last-of-type': {
            width: TEAM_DRAWER_WIDTH,
        },
    },
    drawerPaperMobile: {
        // minWidth: '100vw',
        flexDirection: 'row',
        '&>div:last-of-type': {
            minWidth: TEAM_DRAWER_WIDTH,
            width: '100%',
        },
    },
    actionsDrawer: {
        overflowY: 'auto',
        backgroundColor: theme.palette.primary.main,
        color: theme.palette.primary.contrastText,
    },
});

const ChannelSidebar = ({ classes, isOpen, onToggle }) => {
    const drawerContent = (
        <React.Fragment>
            <div />
        </React.Fragment>
    );

    return (
        <React.Fragment>
            <Hidden mdUp>
                <SwipeableDrawer
                    anchor="right"
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

ChannelSidebar.propTypes = {
    classes: PropTypes.objectOf(PropTypes.string).isRequired,
    isOpen: PropTypes.bool.isRequired,
    onToggle: PropTypes.func.isRequired,
};

export default withStyles(styles)(ChannelSidebar);
