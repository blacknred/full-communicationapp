import React from 'react';
import PropTypes from 'prop-types';

import { withStyles } from '@material-ui/core/styles';

const styles = {
    frame: {
        height: '100vh',
        zIndex: 1,
        overflow: 'hidden',
        position: 'relative',
        display: 'flex',
        width: '100%',
    },
    content: {
        flexGrow: 1,
        height: '100%',
        width: '100%',
        display: 'flex',
        position: 'relative',
        flexDirection: 'column',
    },
};

const AppWrapper = ({ classes, children: [sidebar, ...rest] }) => (
    <div className={classes.frame}>
        {sidebar}
        <div className={classes.content}>
            {rest}
        </div>
    </div>
);

AppWrapper.propTypes = {
    classes: PropTypes.objectOf(PropTypes.string).isRequired,
    children: PropTypes.node.isRequired,
};

export default withStyles(styles)(AppWrapper);
