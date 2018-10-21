import React from 'react';
import PropTypes from 'prop-types';

import {
    Typography,
} from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';

const styles = {
    root: {
        margin: '0 auto',
    },
};

const Error = ({ classes, text }) => (
    <Typography
        variant="title"
        className={classes.root}
    >
        {text}
    </Typography>
);

Error.propTypes = {
    classes: PropTypes.objectOf(PropTypes.string).isRequired,
    text: PropTypes.string.isRequired,
};

export default withStyles(styles)(Error);
