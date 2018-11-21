import React from 'react';
import PropTypes from 'prop-types';

import { withStyles } from '@material-ui/core/styles';

const styles = {
    frame: {
        height: '100vh',
        overflow: 'hidden',
        display: 'flex',
        width: '100%',
    },
    column: {
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
    },
    row: {
        flex: 1,
        display: 'flex',
        minHeight: 0,
    },
};

const HomeWrapper = ({ classes, children: [leftSidebar, content] }) => {
    const [header, rightSidebar, ...rest] = content.props.children;
    return (
        <div className={classes.frame}>
            {leftSidebar}
            <div className={classes.column}>
                {header}
                <div className={classes.row}>
                    <div className={classes.column}>
                        {rest}
                    </div>
                    {rightSidebar}
                </div>
            </div>
        </div>
    );
};

HomeWrapper.propTypes = {
    classes: PropTypes.objectOf(PropTypes.string).isRequired,
    children: PropTypes.node.isRequired,
};

export default withStyles(styles)(HomeWrapper);
