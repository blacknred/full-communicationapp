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
        height: 500,
    },
});

const RegisterForm = ({
    classes, username, email, password, token,
    errors: { usernameError, passwordError, emailError },
    onChange, onSubmit,
}) => {
    const form = (
        <div className={classes.form}>
            <Typography
                component={Link}
                to="/"
                variant="h4"
                className={classes.title}
                children={process.env.REACT_APP_WEBSITE_NAME.split('-')[0]}
            />
            <Typography
                variant="subtitle1"
                children={process.env.REACT_APP_WEBSITE_NAME.split('-')[1]}
            />
            <TextField
                required
                fullWidth
                id="username"
                name="username"
                label="Username"
                autoComplete="username"
                autoFocus
                defaultValue={username}
                error={!!usernameError}
                helperText={usernameError}
                onChange={onChange}
                variant="outlined"
            />
            <TextField
                required
                fullWidth
                id="email"
                name="email"
                label="Email Address"
                autoComplete="email"
                defaultValue={email}
                error={!!emailError}
                helperText={emailError}
                onChange={onChange}
                variant="outlined"
                disabled={!!token}
            />
            <TextField
                required
                fullWidth
                id="password"
                name="password"
                label="Password"
                type="password"
                autoComplete="current-password"
                defaultValue={password}
                error={!!passwordError}
                helperText={passwordError}
                onChange={onChange}
                variant="outlined"
            />
            <Button
                type="submit"
                fullWidth
                variant="contained"
                size="large"
                color="primary"
                className={classes.submit}
                onClick={onSubmit}
                children="Sign up"
            />
            <Button
                component={Link}
                to={`/login${token}`}
                fullWidth
                children="Already have account?"
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

RegisterForm.propTypes = {
    classes: PropTypes.objectOf(PropTypes.string).isRequired,
    username: PropTypes.string.isRequired,
    email: PropTypes.string.isRequired,
    password: PropTypes.string.isRequired,
    token: PropTypes.string,
    errors: PropTypes.shape({
        usernameError: PropTypes.string,
        emailError: PropTypes.string,
        passwordError: PropTypes.string,
    }).isRequired,
    onChange: PropTypes.func.isRequired,
    onSubmit: PropTypes.func.isRequired,
};

export default withStyles(styles)(RegisterForm);
