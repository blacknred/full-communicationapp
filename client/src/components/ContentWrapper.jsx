import React from 'react';
import PropTypes from 'prop-types';

import { withStyles } from '@material-ui/core/styles';

const styles = {
    root: {
        flexGrow: 1,
        height: '100%',
        width: '100%',
        display: 'flex',
        position: 'relative',
        flexDirection: 'column',
    },
};

const ContentWrapper = ({ classes, children }) => (
    <div className={classes.root}>
        {children}
    </div>
);

ContentWrapper.propTypes = {
    classes: PropTypes.objectOf(PropTypes.string).isRequired,
    children: PropTypes.node.isRequired,
};

export default withStyles(styles)(ContentWrapper);
