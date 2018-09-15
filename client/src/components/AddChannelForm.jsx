import React from 'react';
import PropTypes from 'prop-types';

import {
    Switch,
    Dialog,
    Button,
    TextField,
    DialogTitle,
    DialogContent,
    DialogActions,
} from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';

const styles = theme => ({
    form: {
        minWidth: 350,
        marginTop: theme.spacing.unit * 2,
        width: '100%', // Fix IE11 issue.
    },
    // submit: {
    //     margin: `${theme.spacing.unit * 2}px 0`,
    // },
});

const AddChannelForm = ({
    classes, open, name, nameError, isPublic, onChange, onSubmit, onClose,
}) => (
    <Dialog
        open={open}
        onClose={onClose}
        aria-labelledby="form-dialog-title"
    >
        <DialogTitle>Add new channel</DialogTitle>
        <DialogContent>
            <TextField
                autoFocus
                required
                fullWidth
                id="name"
                name="name"
                label="Channel name"
                autoComplete="name"
                className={classes.form}
                defaultValue={name}
                error={!!nameError}
                helperText={nameError}
                onChange={e => onChange('name', e.target.value)}
            />
            <Switch
                checked={isPublic}
                onChange={onChange('isPublic', !isPublic)}
                value="Make channel public"
            />
        </DialogContent>
        <DialogActions>
            <Button
                // variant="raised"
                onClick={onClose}
                children="Cansel"
            />
            <Button
                type="submit"
                variant="raised"
                color="primary"
                className={classes.submit}
                onClick={onSubmit}
                children="Create Team"
                dasabled={name.length === 0}
            />
        </DialogActions>
    </Dialog>
);

AddChannelForm.propTypes = {
    classes: PropTypes.objectOf(PropTypes.string).isRequired,
    open: PropTypes.bool.isRequired,
    name: PropTypes.string.isRequired,
    nameError: PropTypes.string.isRequired,
    isPublic: PropTypes.bool.isRequired,
    onChange: PropTypes.func.isRequired,
    onSubmit: PropTypes.func.isRequired,
    onClose: PropTypes.func.isRequired,
};

export default withStyles(styles)(AddChannelForm);
