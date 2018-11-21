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
        minWidth: '20em',
    },
});

const NewTeamMemberForm = ({
    classes, width, email, emailError, onClose, onChange, onSubmit,
}) => (
    <Dialog
        open
        fullScreen={isWidthDown('sm', width)}
        onClose={onClose}
    >
        <DialogTitle>Add people to your team</DialogTitle>
        <DialogContent>
            <TextField
                autoFocus
                required
                fullWidth
                id="email"
                name="email"
                type="email"
                label="New member email"
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
                onClick={onClose}
                children="Cansel"
            />
            <Button
                type="submit"
                variant="contained"
                color="primary"
                onClick={onSubmit}
                children="Invite"
                disabled={email.length === 0}
            />
        </DialogActions>
    </Dialog>
);

NewTeamMemberForm.propTypes = {
    classes: PropTypes.objectOf(PropTypes.string).isRequired,
    width: PropTypes.string.isRequired,
    email: PropTypes.string.isRequired,
    emailError: PropTypes.string.isRequired,
    onChange: PropTypes.func.isRequired,
    onSubmit: PropTypes.func.isRequired,
    onClose: PropTypes.func.isRequired,
};

export default compose(withStyles(styles), withWidth())(NewTeamMemberForm);
