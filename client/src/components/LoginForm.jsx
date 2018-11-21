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
        height: 450,
    },
});

const LoginForm = ({
    classes, email, password, errors: { passwordError, emailError },
    token, onChange, onSubmit,
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
                variant="subtitle1"
                children={process.env.REACT_APP_WEBSITE_NAME.split('-')[1]}
            />
            <TextField
                autoFocus={!token}
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
                autoFocus={!!token}
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
                children="Sign in"
            />
            <Button
                component={Link}
                to={`/register${token}`}
                fullWidth
                children="Don`t have account yet?"
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

LoginForm.propTypes = {
    classes: PropTypes.objectOf(PropTypes.string).isRequired,
    email: PropTypes.string.isRequired,
    password: PropTypes.string.isRequired,
    token: PropTypes.string,
    errors: PropTypes.shape({
        emailError: PropTypes.string,
        passwordError: PropTypes.string,
    }).isRequired,
    onChange: PropTypes.func.isRequired,
    onSubmit: PropTypes.func.isRequired,
};

export default withStyles(styles)(LoginForm);
