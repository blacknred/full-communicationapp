import React from 'react';
import PropTypes from 'prop-types';
import { compose } from 'recompose';

import {
    Dialog,
    Button,
    TextField,
    DialogTitle,
    DialogContent,
    DialogActions,
} from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';
import withWidth, { isWidthDown } from '@material-ui/core/withWidth';

const styles = theme => ({
    form: {
        marginTop: theme.spacing.unit * 2,
        minWidth: 300,
        width: '100%', // Fix IE11 issue.
    },
});

const InvitePeopleForm = ({
    classes, width, open, email, emailError, onClose, onChange, onSubmit,
}) => (
    <Dialog
        open={open}
        fullScreen={isWidthDown('sm', width)}
        onClose={() => onClose('isInvitePeopleModalOpen')}
    >
        <DialogTitle>Add people to your team</DialogTitle>
        <DialogContent>
            <TextField
                
                autoFocus
                required
                fullWidth
                id="email"
                name="email"
                label="User's email"
                autoComplete="email"
                className={classes.form}
                defaultValue={email}
                error={!!emailError}
                helperText={emailError}
                onChange={onChange}
            />
        </DialogContent>
        <DialogActions>
            <Button
                onClick={() => onClose('isInvitePeopleModalOpen')}
                children="Cansel"
            />
            <Button
                type="submit"
                variant="raised"
                color="primary"
                className={classes.submit}
                onClick={onSubmit}
                children="Invite"
                disabled={email.length === 0}
            />
        </DialogActions>
    </Dialog>
);

InvitePeopleForm.propTypes = {
    classes: PropTypes.objectOf(PropTypes.string).isRequired,
    width: PropTypes.string.isRequired,
    open: PropTypes.bool.isRequired,
    email: PropTypes.string.isRequired,
    emailError: PropTypes.string.isRequired,
    onChange: PropTypes.func.isRequired,
    onSubmit: PropTypes.func.isRequired,
    onClose: PropTypes.func.isRequired,
};

export default compose(withStyles(styles), withWidth())(InvitePeopleForm);
