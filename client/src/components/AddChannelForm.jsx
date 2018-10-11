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

const styles = theme => ({
    form: {
        marginTop: theme.spacing.unit * 2,
        width: '100%', // Fix IE11 issue.
    },
});

const AddChannelForm = ({
    classes, width, open, channelName, nameError, isPrivate,
    onChange, onSubmit, onClose,
}) => (
    <Dialog
        open={open}
        fullScreen={isWidthDown('sm', width)}
        onClose={() => onClose('isAddChannelModalOpen')}
    >
        <DialogTitle>Add new channel</DialogTitle>
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
                defaultValue={channelName}
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
                isPrivate && (
                    // TODO: select teammates and update members in upper container state
                )
            }
        </DialogContent>
        <DialogActions>
            <Button
                onClick={() => onClose('isAddChannelModalOpen')}
                children="Cansel"
            />
            <Button
                type="submit"
                variant="raised"
                color="primary"
                onClick={onSubmit}
                children="Create Channel"
                disabled={channelName.length === 0}
            />
        </DialogActions>
    </Dialog>
);

AddChannelForm.propTypes = {
    classes: PropTypes.objectOf(PropTypes.string).isRequired,
    width: PropTypes.string.isRequired,
    open: PropTypes.bool.isRequired,
    channelName: PropTypes.string.isRequired,
    nameError: PropTypes.string.isRequired,
    isPrivate: PropTypes.bool.isRequired,
    onChange: PropTypes.func.isRequired,
    onSubmit: PropTypes.func.isRequired,
    onClose: PropTypes.func.isRequired,
};

export default compose(withStyles(styles), withWidth())(AddChannelForm);
