import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

import {
    Paper,
    Avatar,
    Button,
    TextField,
    Typography,
} from '@material-ui/core';
import { AccountCircle } from '@material-ui/icons';
import { withStyles } from '@material-ui/core/styles';

const styles = theme => ({
    layout: {
        width: 'auto',
        display: 'block', // Fix IE11 issue.
        marginLeft: theme.spacing.unit * 3,
        marginRight: theme.spacing.unit * 3,
        [theme.breakpoints.up(380 + theme.spacing.unit * 3 * 2)]: {
            width: 380,
            marginLeft: 'auto',
            marginRight: 'auto',
        },
    },
    paper: {
        marginTop: theme.spacing.unit * 8,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        padding: theme.spacing.unit * 4,
    },
    avatar: {
        marginBottom: theme.spacing.unit * 3,
    },
    form: {
        marginTop: theme.spacing.unit * 2,
        width: '100%', // Fix IE11 issue.
        '& > div': {
            marginBottom: theme.spacing.unit * 3,
        },
    },
    submit: {
        margin: `${theme.spacing.unit * 3}px 0`,
    },
});

const RegisterForm = ({
    classes, username, email, password,
    errors: { usernameError, passwordError, emailError },
    onChange, onSubmit,
}) => (
    <main className={classes.layout}>
        <Paper className={classes.paper}>
            <Avatar className={classes.avatar}>
                <AccountCircle />
            </Avatar>
            <Typography variant="headline">Sign up</Typography>
            <div className={classes.form}>
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
                />
                <Button
                    type="submit"
                    fullWidth
                    variant="raised"
                    color="primary"
                    className={classes.submit}
                    onClick={onSubmit}
                    children="Sign up"
                />
                <Button
                    component={Link}
                    to="/login"
                    fullWidth
                    children="Already have account?"
                />
            </div>
        </Paper>
    </main>
);

RegisterForm.propTypes = {
    classes: PropTypes.objectOf(PropTypes.string).isRequired,
    username: PropTypes.string.isRequired,
    email: PropTypes.string.isRequired,
    password: PropTypes.string.isRequired,
    errors: PropTypes.shape({
        usernameError: PropTypes.string,
        emailError: PropTypes.string,
        passwordError: PropTypes.string,
    }).isRequired,
    onChange: PropTypes.func.isRequired,
    onSubmit: PropTypes.func.isRequired,
};

export default withStyles(styles)(RegisterForm);
