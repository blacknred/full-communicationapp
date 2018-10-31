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

const LoginForm = ({
    classes, email, password, errors: { passwordError, emailError },
    onChange, onSubmit,
}) => (
    <main className={classes.layout}>
        <Paper className={classes.paper}>
            <Avatar className={classes.avatar}>
                <AccountCircle />
            </Avatar>
            <Typography variant="headline">Sign in</Typography>
            <div className={classes.form}>
                <TextField
                    autoFocus
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
                    variant="contained"
                    color="primary"
                    className={classes.submit}
                    onClick={onSubmit}
                    children="Sign in"
                />
                <Button
                    component={Link}
                    to="/register"
                    fullWidth
                    children="Don`t have account yet?"
                />
            </div>
        </Paper>
    </main>
);

LoginForm.propTypes = {
    classes: PropTypes.objectOf(PropTypes.string).isRequired,
    email: PropTypes.string.isRequired,
    password: PropTypes.string.isRequired,
    errors: PropTypes.shape({
        emailError: PropTypes.string,
        passwordError: PropTypes.string,
    }).isRequired,
    onChange: PropTypes.func.isRequired,
    onSubmit: PropTypes.func.isRequired,
};

export default withStyles(styles)(LoginForm);
