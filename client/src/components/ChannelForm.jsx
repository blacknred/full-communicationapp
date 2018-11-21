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

import MembersSelectForm from './MembersSelectForm';

const styles = theme => ({
    paper: {
        overflowY: 'hidden',
    },
    root: {
        overflowY: 'initial',
        minWidth: 400,
    },
    form: {
        marginTop: theme.spacing.unit * 2,
        width: '100%', // Fix IE11 issue.
    },
});

const NewChannelForm = ({
    classes, width, name, description, private: isPrivate,
    isUpdate, errors: { nameError }, onChange, onSubmit, onClose,
    members, dm, teamMembers,
}) => (
    <Dialog
        open
        onClose={onClose}
        disableBackdropClick
        fullScreen={isWidthDown('sm', width)}
        classes={{ paper: classes.paper }}
    >
        <DialogTitle>
            {isUpdate ? 'Update the channel' : 'Add new channel'}
        </DialogTitle>
        <DialogContent classes={{ root: classes.root }}>
            {
                !dm && (
                    <React.Fragment>
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
                                        // disabled={isUpdate}
                                        value={!isPrivate}
                                    />
                                )}
                                label="Private channel"
                            />
                        </Toolbar>
                    </React.Fragment>
                )
            }
            {
                (isPrivate || dm) && (
                    <MembersSelectForm
                        onChange={onChange}
                        options={teamMembers}
                        members={members}
                    />
                )
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
                disabled={
                    dm
                        ? members.length === 0
                        : !(name.length > 0 && (isPrivate ? members.length > 0 : true))
                }
            >
                {dm && 'Start Messaging'}
                {!dm && (isUpdate ? 'Update channel' : 'Create channel')}
            </Button>
        </DialogActions>
    </Dialog>
);

NewChannelForm.propTypes = {
    classes: PropTypes.objectOf(PropTypes.string).isRequired,
    width: PropTypes.string.isRequired,
    dm: PropTypes.bool.isRequired,
    isUpdate: PropTypes.bool,
    name: PropTypes.string.isRequired,
    description: PropTypes.string,
    members: PropTypes.arrayOf(PropTypes.shape()).isRequired,
    teamMembers: PropTypes.arrayOf(PropTypes.shape()).isRequired,
    errors: PropTypes.shape({
        nameError: PropTypes.string,
    }).isRequired,
    private: PropTypes.bool.isRequired,
    onChange: PropTypes.func.isRequired,
    onSubmit: PropTypes.func.isRequired,
    onClose: PropTypes.func.isRequired,
};

export default compose(withStyles(styles), withWidth())(NewChannelForm);
