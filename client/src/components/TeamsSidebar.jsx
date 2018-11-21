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

const TeamsSidebar = ({
    classes, isMobileOpen, onMobileOpenToggle,
    children: [teamsList, teamBlock], isFullTeamsOpen,
}) => {
    const content = (
        <React.Fragment>
            <Hidden only={isFullTeamsOpen ? null : 'xs'}>
                {teamsList}
            </Hidden>
            <Hidden only={isFullTeamsOpen ? 'xs' : null}>
                <List
                    disablePadding
                    className={classes.teamDrawer}
                >
                    {teamBlock}
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
                    {content}
                </SwipeableDrawer>
            </Hidden>
            <Hidden smDown implementation="css">
                <Slide in direction="right">
                    <Drawer
                        variant="permanent"
                        anchor="left"
                        classes={{ paper: classes.drawerPaper }}
                        SlideProps={{
                            timeout: 0,
                            direction: 'right',
                        }}
                    >
                        {content}
                    </Drawer>
                </Slide>
            </Hidden>
        </React.Fragment>
    );
};

TeamsSidebar.propTypes = {
    classes: PropTypes.objectOf(PropTypes.string).isRequired,
    children: PropTypes.node.isRequired,
    isMobileOpen: PropTypes.bool.isRequired,
    isFullTeamsOpen: PropTypes.bool.isRequired,
    onMobileOpenToggle: PropTypes.func.isRequired,
};

export default withStyles(styles)(TeamsSidebar);
