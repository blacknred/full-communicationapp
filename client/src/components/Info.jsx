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

const InfoModal = ({
    classes, width, onClose, options, members,
}) => (
    <Dialog
        open
        fullScreen={isWidthDown('sm', width)}
        onClose={onClose}
        className={classes.form}
        maxWidth="xs"
    >
        <DialogTitle>Summary</DialogTitle>
        <DialogContent>
            {
                options.map(({ option, value }) => (
                    <DialogContentText>
                        {option}-{value}
                    </DialogContentText>
                ))
            }
        </DialogContent>
        <DialogContent>
            {
                members.map(({ name, online }) => (
                    <DialogContentText>
                        {name}-{online}
                    </DialogContentText>
                ))
            }
        </DialogContent>
        <DialogActions>
            <Button
                children="Close"
                onClick={onClose}
            />
        </DialogActions>
    </Dialog>
);

InfoModal.propTypes = {
    classes: PropTypes.objectOf(PropTypes.string).isRequired,
    width: PropTypes.string.isRequired,
    onClose: PropTypes.func.isRequired,
    options: PropTypes.arrayOf(PropTypes.shape({
        option: PropTypes.string.isRequired,
        value: PropTypes.string.isRequired,
    })).isRequired,
    members: PropTypes.arrayOf(PropTypes.shape({
        name: PropTypes.string.isRequired,
        online: PropTypes.bool.isRequired,
    })).isRequired,
};

export default compose(withStyles(styles), withWidth())(InfoModal);
