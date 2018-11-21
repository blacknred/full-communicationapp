import React from 'react';
import PropTypes from 'prop-types';
import { observer, inject } from 'mobx-react';

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
    note: {
        fontSize: '1em',
    },
});

const Notification = inject('store')(observer(({
    classes, store: { notification, deleteNotification },
}) => {
    const onClose = (event, reason) => {
        if (reason === 'clickaway') return;
        deleteNotification();
    };
    return (
        <Snackbar
            anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'right',
            }}
            open={!!notification}
            autoHideDuration={6000}
            onClose={onClose}
            ContentProps={{
                'aria-describedby': 'note-id',
                className: classes.note,
            }}
            message={notification}
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
}));

Notification.propTypes = {
    classes: PropTypes.objectOf(PropTypes.string).isRequired,
    // text: PropTypes.string.isRequired,
    // open: PropTypes.bool.isRequired,
    // onClose: PropTypes.func.isRequired,
};

export default withStyles(styles)(Notification);
