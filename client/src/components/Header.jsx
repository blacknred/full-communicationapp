import React from 'react';
import PropTypes from 'prop-types';

import AppBar from '@material-ui/core/AppBar';
import Divider from '@material-ui/core/Divider';
import Toolbar from '@material-ui/core/Toolbar';
import { withStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';

const drawersWidth = 90 + 240;

const styles = {
    appBar: {
        width: `calc(100% - ${drawersWidth}px)`,
        marginLeft: drawersWidth,
    },
};

const Header = ({ classes, channelName }) => (
    <AppBar
        position="absolute"
        className={classes.appBar}
        color="default"
        elevation={0}
    >
        <Toolbar>
            <Typography variant="title">
                {`#${channelName}`}
            </Typography>
        </Toolbar>
        <Divider light />
    </AppBar>
);

Header.propTypes = {
    classes: PropTypes.objectOf(PropTypes.string).isRequired,
    channelName: PropTypes.string.isRequired,
};

export default withStyles(styles)(Header);
