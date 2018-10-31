import React from 'react';
import PropTypes from 'prop-types';
import { compose } from 'recompose';

import {
    Switch,
    Dialog,
    Button,
    Toolbar,
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
    classes, width, open, name, description, private: isPrivate,
    isUpdate, errors: { nameError }, onChange, onSubmit, onClose,
}) => (
    <Dialog
        open={open}
        fullScreen={isWidthDown('sm', width)}
        onClose={onClose}
    >
        <DialogTitle>
            {`${isUpdate ? 'Update the' : 'Add new'} channel`}
        </DialogTitle>
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
                onChange={onChange}
            />
            <TextField
                fullWidth
                id="description"
                name="description"
                label="Channel description"
                className={classes.form}
                defaultValue={description}
                onChange={onChange}
            />
            <Toolbar disableGutters>
                <FormControlLabel
                    control={(
                        <Switch
                            checked={isPrivate}
                            name="private"
                            onChange={onChange}
                            disabled={isUpdate}
                            value={(!isPrivate).toString()}
                        />
                    )}
                    label="Make channel private"
                />
            </Toolbar>

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
                variant="contained"
                color="primary"
                onClick={onSubmit}
                children={`${isUpdate ? 'Update' : 'Create'} Channel`}
                disabled={name.length === 0}
            />
        </DialogActions>
    </Dialog>
);

NewChannelForm.propTypes = {
    classes: PropTypes.objectOf(PropTypes.string).isRequired,
    width: PropTypes.string.isRequired,
    open: PropTypes.bool.isRequired,
    isUpdate: PropTypes.bool,
    name: PropTypes.string.isRequired,
    description: PropTypes.string,
    errors: PropTypes.shape({
        nameError: PropTypes.string,
    }).isRequired,
    private: PropTypes.bool.isRequired,
    onChange: PropTypes.func.isRequired,
    onSubmit: PropTypes.func.isRequired,
    onClose: PropTypes.func.isRequired,
};

export default compose(withStyles(styles), withWidth())(NewChannelForm);
