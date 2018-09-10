import React from 'react';
import gql from 'graphql-tag';
import PropTypes from 'prop-types';
import { graphql } from 'react-apollo';
import { Link } from 'react-router-dom';

import Paper from '@material-ui/core/Paper';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import { withStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import AccountCircle from '@material-ui/icons/AccountCircle';

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

const REGISTER_MUTATION = gql`
    mutation Register($username: String!, $email: String!, $password: String!) {
        register(username: $username, email: $email, password: $password) {
            ok
            errors {
                path
                message
            }
        }
    }
`;

class Register extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            username: '',
            email: '',
            password: '',
            errors: {},
        };
    }

    onChangeHandler = (e) => {
        const { name, value } = e.target;
        this.setState({ [name]: value });
    }

    onSubmitHandler = async (e) => {
        e.preventDefault();
        const { history, mutate } = this.props;
        const { username, email, password } = this.state;
        const res = await mutate({
            variables: { username, email, password },
        });
        const { ok, errors } = res.data.register;
        if (ok) {
            history.push('/');
        } else {
            const err = {};
            errors.forEach(({ path, message }) => {
                err[`${path}Error`] = message;
            });
            this.setState({ errors: err });
        }
    }

    render() {
        const {
            username, email, password,
            errors: { usernameError, emailError, passwordError },
        } = this.state;
        const { classes } = this.props;
        return (
            <main className={classes.layout}>
                <Paper className={classes.paper}>
                    <Avatar className={classes.avatar}>
                        <AccountCircle />
                    </Avatar>
                    <Typography variant="headline">Sign up</Typography>
                    <form className={classes.form}>
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
                            onChange={this.onChangeHandler}
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
                            onChange={this.onChangeHandler}
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
                            onChange={this.onChangeHandler}
                        />
                        <Button
                            type="submit"
                            fullWidth
                            variant="raised"
                            color="primary"
                            className={classes.submit}
                            onClick={this.onSubmitHandler}
                            children="Sign up"
                        />
                        <Button
                            component={Link}
                            to="/login"
                            fullWidth
                            children="Already have account?"
                        />
                    </form>
                </Paper>
            </main>
        );
    }
}

Register.propTypes = {
    classes: PropTypes.objectOf(PropTypes.string).isRequired,
};

export default graphql(REGISTER_MUTATION)(withStyles(styles)(Register));
