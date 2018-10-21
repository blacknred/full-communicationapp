import React from 'react';
import PropTypes from 'prop-types';

import {
    Snackbar,
    IconButton,
} from '@material-ui/core';
import { Close } from '@material-ui/icons';
import { withStyles } from '@material-ui/core/styles';

const styles = theme => ({
    close: {
        padding: theme.spacing.unit / 2,
    },
});

const NotificationContent = ({
    classes, text, open, onClose,
}) => (
    <Snackbar
        anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'bottom',
        }}
        open={open}
        autoHideDuration={6000}
        onClose={onClose}
        ContentProps={{ 'aria-describedby': 'message-id' }}
        message={<span id="note-id">{text}</span>}
        action={(
            <IconButton
                aria-label="Close"
                color="inherit"
                className={classes.close}
                onClick={onClose}
            >
                <Close />
            </IconButton>
        )}
    />
);

NotificationContent.propTypes = {
    classes: PropTypes.objectOf(PropTypes.string).isRequired,
    text: PropTypes.string.isRequired,
    open: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
};

export default withStyles(styles)(NotificationContent);
