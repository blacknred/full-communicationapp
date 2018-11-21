import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

import {
    Paper,
    Button,
    Hidden,
    TextField,
    Typography,
} from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';

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
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        padding: theme.spacing.unit * 4,
        justifyContent: 'space-around',
        height: 400,
    },
});

const NewTeamForm = ({
    classes, name, description, onChange, onSubmit,
    errors: { nameError, descriptionError },
}) => {
    const form = (
        <div className={classes.form}>
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
                onChange={onChange}
                variant="outlined"
            />
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
        <main className={classes.layout}>
            <Hidden only="xs">
                <Paper className={classes.paper}>
                    {form}
                </Paper>
            </Hidden>
            <Hidden smUp>
                {form}
            </Hidden>
        </main>
    );
};

NewTeamForm.propTypes = {
    classes: PropTypes.objectOf(PropTypes.string).isRequired,
    name: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
    errors: PropTypes.shape({
        nameError: PropTypes.string,
        descriptionError: PropTypes.string,
    }).isRequired,
    onChange: PropTypes.func.isRequired,
    onSubmit: PropTypes.func.isRequired,
};

export default withStyles(styles)(NewTeamForm);
