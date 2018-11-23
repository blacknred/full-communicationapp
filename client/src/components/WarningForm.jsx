import React from 'react';
import PropTypes from 'prop-types';
import { compose } from 'recompose';

import {
    Dialog,
    Button,
    DialogTitle,
    DialogContent,
    DialogActions,
    DialogContentText,
} from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';
import withWidth, { isWidthDown } from '@material-ui/core/withWidth';

const styles = theme => ({
    form: {
        marginTop: theme.spacing.unit * 2,
        width: '100%', // Fix IE11 issue.
    },
});

const WarningForm = ({
    classes, width, message, onSubmit, onClose,
}) => (
    <Dialog
        open
        disableBackdropClick
        fullScreen={isWidthDown('sm', width)}
        onClose={onClose}
        className={classes.form}
        maxWidth="xs"
    >
        <DialogTitle>Confirmation</DialogTitle>
        <DialogContent>
            <DialogContentText>
                {message}
            </DialogContentText>
        </DialogContent>
        <DialogActions>
            <Button
                children="Cancel"
                onClick={onClose}
            />
            <Button
                onClick={onSubmit}
                color="primary"
                children="Proceed"
            />
        </DialogActions>
    </Dialog>
);

WarningForm.propTypes = {
    classes: PropTypes.objectOf(PropTypes.string).isRequired,
    width: PropTypes.string.isRequired,
    message: PropTypes.string.isRequired,
    onSubmit: PropTypes.func.isRequired,
    onClose: PropTypes.func.isRequired,
};

export default compose(withStyles(styles), withWidth())(WarningForm);
