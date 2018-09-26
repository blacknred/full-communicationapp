import React from 'react';
import PropTypes from 'prop-types';

import {
    Hidden,
    Divider,
    Toolbar,
    IconButton,
    Typography,
} from '@material-ui/core';
import { Menu } from '@material-ui/icons';
import { withStyles } from '@material-ui/core/styles';

const styles = {
    toolbar: {},
};

const HeaderContent = ({ classes, channelName }) => (
    <React.Fragment>
        <Toolbar className={classes.toolbar}>
            <Hidden mdUp>
                <IconButton>
                    <Menu />
                </IconButton>
            </Hidden>
            <Typography variant="title">
                {`#${channelName}`}
            </Typography>
        </Toolbar>
        <Divider light />
    </React.Fragment>
);

HeaderContent.propTypes = {
    classes: PropTypes.objectOf(PropTypes.string).isRequired,
    channelName: PropTypes.string.isRequired,
};

export default withStyles(styles)(HeaderContent);
