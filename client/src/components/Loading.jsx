import React from 'react';
import PropTypes from 'prop-types';

import {
    LinearProgress,
    CircularProgress,
} from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';

const styles = {
    root: {
        height: '100vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
    },
    linear: {
        alignSelf: 'start',
        width: '100%',
        zIndex: 11111,
    },
    circular: {
        alignSelf: 'center',
        margin: '0 auto',
    },
};

const Loading = ({ classes, up, small }) => (
    <div className={classes.root}>
        {
            up
                ? (
                    <LinearProgress
                        className={classes.linear}
                        color="secondary"
                    />
                ) : (
                    <CircularProgress
                        className={classes.circular}
                        size={small ? 35 : 50}
                        color="secondary"
                        thickness={7}
                    />
                )
        }
    </div>
);

Loading.propTypes = {
    classes: PropTypes.objectOf(PropTypes.string).isRequired,
    up: PropTypes.bool,
    small: PropTypes.bool,
};

export default withStyles(styles)(Loading);
