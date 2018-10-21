import React from 'react';
import PropTypes from 'prop-types';
import { compose } from 'recompose';

import {
    Switch,
    Dialog,
    Button,
    TextField,
    DialogTitle,
    DialogContent,
    DialogActions,
    FormControlLabel,
} from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';
import withWidth, { isWidthDown } from '@material-ui/core/withWidth';

import MembersMultiSelect from './MembersMultiSelect';

const styles = theme => ({
    form: {
        marginTop: theme.spacing.unit * 2,
        width: '100%', // Fix IE11 issue.
    },
});

const NewChannelForm = ({
    classes, width, open, name, nameError, isPrivate, isCreating,
    onChange, onSubmit, onClose,
}) => (
    <Dialog
        open={open}
        fullScreen={isWidthDown('sm', width)}
        onClose={onClose}
    >
        <DialogTitle>
            {
                isCreating
                    ? 'Add new channel'
                    : 'Update channel'
            }
        </DialogTitle>
        <DialogContent>
            <TextField
                autoFocus
                required
                fullWidth
                id="channelName"
                name="channelName"
                label="Channel name"
                autoComplete="name"
                className={classes.form}
                defaultValue={name}
                error={!!nameError}
                helperText={nameError}
                onChange={onChange}
            />
            <FormControlLabel
                control={(
                    <Switch
                        checked={isPrivate}
                        name="isPrivate"
                        onChange={onChange}
                        value={(!isPrivate).toString()}
                    />
                )}
                label="Make channel private"
            />
            {
                isPrivate && <MembersMultiSelect />
            }
        </DialogContent>
        <DialogActions>
            <Button
                onClick={onClose}
                children="Cansel"
            />
            <Button
                type="submit"
                variant="raised"
                color="primary"
                onClick={onSubmit}
                children={`${isCreating ? 'Create' : 'Update'} Channel`}
                disabled={name.length === 0}
            />
        </DialogActions>
    </Dialog>
);

NewChannelForm.propTypes = {
    classes: PropTypes.objectOf(PropTypes.string).isRequired,
    width: PropTypes.string.isRequired,
    open: PropTypes.bool.isRequired,
    isCreating: PropTypes.bool,
    name: PropTypes.string.isRequired,
    nameError: PropTypes.string.isRequired,
    isPrivate: PropTypes.bool.isRequired,
    onChange: PropTypes.func.isRequired,
    onSubmit: PropTypes.func.isRequired,
    onClose: PropTypes.func.isRequired,
};

export default compose(withStyles(styles), withWidth())(NewChannelForm);
