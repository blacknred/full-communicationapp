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
        top: 0,
        left: 0,
        right: 0,
        zIndex: 11111,
    },
    circularRoot: {
        flex: 1,
        display: 'flex',
    },
    circular: {
        alignSelf: 'center',
        margin: '0 auto',
    },
});

const Loading = ({ classes, up, small }) => (
    up ? (
        <LinearProgress
            className={classes.linear}
            color="secondary"
        />
    ) : (
        <div className={classes.circularRoot}>
            <CircularProgress
                className={classes.circular}
                size={small ? 35 : 50}
                color="secondary"
                thickness={7}
            />
        </div>
    )
);

Loading.propTypes = {
    classes: PropTypes.objectOf(PropTypes.string).isRequired,
    up: PropTypes.bool,
    small: PropTypes.bool,
};

export default withStyles(styles)(Loading);
