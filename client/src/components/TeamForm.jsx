import React from 'react';
import PropTypes from 'prop-types';
import { compose } from 'recompose';
import { Link } from 'react-router-dom';

import {
    Paper,
    Dialog,
    Button,
    Hidden,
    TextField,
    Typography,
    DialogTitle,
    DialogContent,
    DialogActions,
} from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';
import withWidth, { isWidthDown } from '@material-ui/core/withWidth';

const styles = theme => ({
    layout: {
        width: 'auto',
        margin: '0 auto',
        display: 'block', // Fix IE11 issue.
        [theme.breakpoints.up(380 + theme.spacing.unit * 3 * 2)]: {
            width: 380,
            marginLeft: 'auto',
            marginRight: 'auto',
        },
    },
    paper: {
        marginTop: theme.spacing.unit * 8,
    },
    title: {
        fontFamily: 'Dosis',
        flexBasis: 70,
    },
    form: {
        marginTop: theme.spacing.unit * 2,
        width: '100%', // Fix IE11 issue.
    },
    pageForm: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        padding: theme.spacing.unit * 4,
        justifyContent: 'space-around',
        height: 400,
    },
});

const NewTeamForm = ({
    classes, width, name, description, onChange, onSubmit, onClose,
    isUpdate, errors: { nameError, descriptionError },
}) => {
    const form = (
        <React.Fragment>
            <TextField
                autoFocus
                required
                fullWidth
                id="name"
                name="name"
                label="Company or group name"
                autoComplete="name"
                defaultValue={name}
                error={!!nameError}
                helperText={nameError}
                onChange={onChange}
                className={classes.form}
                variant="outlined"
            />
            <TextField
                fullWidth
                id="description"
                name="description"
                label="Description"
                defaultValue={description}
                error={!!descriptionError}
                helperText={descriptionError}
                className={classes.form}
                onChange={onChange}
                variant="outlined"
            />
        </React.Fragment>
    );
    const pageForm = (
        <div className={classes.pageForm}>
            <Typography
                variant="h4"
                component={Link}
                to="/"
                className={classes.title}
                children={process.env.REACT_APP_WEBSITE_NAME.split('-')[0]}
            />
            <Typography
                variant="h6"
                children="Create a new Team"
            />
            {form}
            <Button
                type="submit"
                fullWidth
                variant="contained"
                color="primary"
                className={classes.submit}
                onClick={onSubmit}
                children="Create Team"
                disabled={name.length === 0}
                size="large"
            />
        </div>
    );
    return (
        isUpdate
            ? (
                <Dialog
                    open
                    onClose={onClose}
                    disableBackdropClick
                    fullScreen={isWidthDown('sm', width)}
                    classes={{ paper: classes.paper }}
                >
                    <DialogTitle>Update the team</DialogTitle>
                    <DialogContent classes={{ root: classes.root }}>
                        {form}
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
                            disabled={name.length === 0}
                            children="Update"
                        />
                    </DialogActions>
                </Dialog>
            ) : (
                <main className={classes.layout}>
                    <Hidden only="xs">
                        <Paper className={classes.paper}>
                            {pageForm}
                        </Paper>
                    </Hidden>
                    <Hidden smUp>
                        {pageForm}
                    </Hidden>
                </main>
            )
    );
};

NewTeamForm.propTypes = {
    classes: PropTypes.objectOf(PropTypes.string).isRequired,
    width: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
    isUpdate: PropTypes.bool.isRequired,
    errors: PropTypes.shape({
        nameError: PropTypes.string,
    }).isRequired,
    onClose: PropTypes.func,
    onChange: PropTypes.func.isRequired,
    onSubmit: PropTypes.func.isRequired,
};

export default compose(withStyles(styles), withWidth())(NewTeamForm);
