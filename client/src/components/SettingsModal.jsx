import React from 'react';
import PropTypes from 'prop-types';
import { compose } from 'recompose';

import {
    Slide,
    Dialog,
    Button,
    DialogTitle,
    DialogContent,
    DialogActions,
} from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';
import withWidth, { isWidthDown } from '@material-ui/core/withWidth';

const styles = theme => ({
    form: {
        marginTop: theme.spacing.unit * 2,
        width: '100%', // Fix IE11 issue.
    },
});

function Transition(props) {
    return <Slide direction="up" {...props} />;
}

const SettingsModal = ({
    classes, width, open, children, onClose,
}) => (
    <Dialog
        open={open}
        fullScreen={isWidthDown('sm', width)}
        onClose={onClose}
        TransitionComponent={Transition}
        fullWidth
    >
        <DialogTitle>Settings</DialogTitle>
        <DialogContent>
            {children}
        </DialogContent>
        <DialogActions>
            <Button
                onClick={onClose}
                children="Close"
            />
        </DialogActions>
    </Dialog>
);

SettingsModal.propTypes = {
    classes: PropTypes.objectOf(PropTypes.string).isRequired,
    children: PropTypes.node.isRequired,
    width: PropTypes.string.isRequired,
    open: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
};

export default compose(withStyles(styles), withWidth())(SettingsModal);
