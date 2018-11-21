import React from 'react';
import PropTypes from 'prop-types';

import {
    Drawer,
    Hidden,
    SwipeableDrawer,
} from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';

const iOS = process.browser && /iPad|iPhone|iPod/.test(navigator.userAgent);

const TEAM_DRAWER_WIDTH = 310;

const styles = theme => ({
    drawerPaper: {
        flexDirection: 'row',
        maxHeight: '100vh',
        height: '100vh',
        overflow: 'hidden',
        width: TEAM_DRAWER_WIDTH,
        backgroundColor: theme.palette.background.default,
        borderLeft: `1px solid ${theme.palette.divider}`,
    },
    drawerPaperMobile: {
        flexDirection: 'row',
        width: TEAM_DRAWER_WIDTH,
    },
});

const ChannelSidebar = ({ classes, open, onToggle }) => {
    const drawerContent = (
        <div />
    );

    return (
        <React.Fragment>
            <Hidden mdUp>
                <SwipeableDrawer
                    anchor="right"
                    open={open}
                    onOpen={onToggle}
                    onClose={onToggle}
                    classes={{ paper: classes.drawerPaperMobile }}
                    disableBackdropTransition={!iOS}
                    disableDiscovery={iOS}
                >
                    {drawerContent}
                </SwipeableDrawer>
            </Hidden>
            <Hidden smDown implementation="css">
                <Drawer
                    variant="persistent"
                    open={open}
                    anchor="right"
                    transitionDuration={0}
                    PaperProps={{
                        className: classes.drawerPaper,
                        style: { position: open ? 'relative' : 'fixed' },
                    }}
                >
                    {drawerContent}
                </Drawer>
            </Hidden>
        </React.Fragment>
    );
};

ChannelSidebar.propTypes = {
    classes: PropTypes.objectOf(PropTypes.string).isRequired,
    open: PropTypes.bool.isRequired,
    onToggle: PropTypes.func.isRequired,
};

export default withStyles(styles)(ChannelSidebar);
