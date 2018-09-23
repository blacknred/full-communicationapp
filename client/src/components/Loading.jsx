import React from 'react';
import PropTypes from 'prop-types';

import {
    LinearProgress,
    CircularProgress,
} from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';

const styles = theme => ({
    linear: {
        padding: theme.spacing.unit / 2,
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 11111,
    },
    circular: {
        alignSelf: 'center',
        margin: '0 auto',
    },
});

const Loading = ({ classes, up }) => (
    up ? (
        <LinearProgress
            className={classes.linear}
            color="secondary"
        />
    ) : (
        <CircularProgress
            className={classes.circular}
            size={50}
            color="secondary"
            thickness={7}
        />
    )
);

Loading.propTypes = {
    classes: PropTypes.objectOf(PropTypes.string).isRequired,
    up: PropTypes.bool,
};

export default withStyles(styles)(Loading);
