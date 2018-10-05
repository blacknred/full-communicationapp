import React from 'react';
import PropTypes from 'prop-types';

import {
    Fade,
    Chip,
    Hidden,
    AppBar,
    Toolbar,
    IconButton,
    Typography,
} from '@material-ui/core';
import { Menu, MoreHoriz } from '@material-ui/icons';
import { withStyles } from '@material-ui/core/styles';

const styles = theme => ({
    title: {
        flex: 1,
        marginLeft: theme.spacing.unit * 2,
    },
    appBar: {
        backgroundColor: theme.palette.background.paper, // default,
        // boxShadow: `-3px -2px 15px 0px ${theme.palette.primary.main}`,
    },
});

const ContentHeader = ({ classes, title, status }) => (
    <Fade in>
        <AppBar
            elevation={1}
            position="relative"
            color="default"
            className={classes.appBar}
        >
            <Toolbar>
                <Hidden mdUp>
                    <IconButton>
                        <Menu />
                    </IconButton>
                </Hidden>
                <Hidden smDown>
                    <Chip
                        label={status}
                        color="secondary"
                        variant="outlined"
                    />
                </Hidden>
                <Typography
                    variant="title"
                    color="secondary"
                    className={classes.title}
                >
                    {`#${title}`}
                </Typography>
                <IconButton>
                    <MoreHoriz />
                </IconButton>
            </Toolbar>
        </AppBar>
    </Fade>
);

ContentHeader.propTypes = {
    classes: PropTypes.objectOf(PropTypes.string).isRequired,
    title: PropTypes.string.isRequired,
    status: PropTypes.string.isRequired,
};

export default withStyles(styles)(ContentHeader);
