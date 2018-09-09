import React from 'react';
import gql from 'graphql-tag';
import PropTypes from 'prop-types';
import { observer } from 'mobx-react';
import { extendObservable } from 'mobx';
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

const LOGIN_MUTATION = gql`
    mutation Login($email: String!, $password: String!) {
        login(email: $email, password: $password) {
            ok
            token
            refreshToken
            errors {
                path
                message
            }
        }
    }
`;

class Login extends React.Component {
    constructor(props) {
        super(props);

        extendObservable(this, {
            email: '',
            emailErr: '',
            password: '',
            passwordErr: '',
        });
    }

    onChangeHandler = (e) => {
        const { name, value } = e.target;
        this[name] = value;
    }

    onSubmitHandler = async () => {
        const { history, mutate } = this.props;
        const { email, password } = this;
        const res = await mutate({
            variables: { email, password },
        });
        const {
            ok, token, refreshToken, errors,
        } = res.data.login;
        if (ok) {
            localStorage.setItem('token', token);
            localStorage.setItem('refreshToken', refreshToken);
            history.push('/home');
        } else {
            this.emailErr = '';
            this.passwordErr = '';
            errors.forEach(({ path, message }) => {
                this[`${path}Err`] = message;
            });
            this.setState({});
        }
    }

    render() {
        const {
            email, emailErr, password, passwordErr,
        } = this;
        const { classes } = this.props;
        return (
            <main className={classes.layout}>
                <Paper className={classes.paper}>
                    <Avatar className={classes.avatar}>
                        <AccountCircle />
                    </Avatar>
                    <Typography variant="headline">Sign in</Typography>
                    <form className={classes.form}>
                        <TextField
                            autoFocus
                            required
                            fullWidth
                            id="email"
                            name="email"
                            label="Email Address"
                            autoComplete="email"
                            defaultValue={email}
                            error={emailErr.length > 0}
                            helperText={emailErr}
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
                            error={passwordErr.length > 0}
                            helperText={passwordErr}
                            onChange={this.onChangeHandler}
                        />
                        <Button
                            type="submit"
                            fullWidth
                            variant="raised"
                            color="primary"
                            className={classes.submit}
                            onClick={this.onSubmitHandler}
                            children="Sign in"
                        />
                        <Button
                            component={Link}
                            to="/register"
                            fullWidth
                            children="Don`t have account yet?"
                        />
                    </form>
                </Paper>
            </main>
        );
    }
}

Login.propTypes = {
    classes: PropTypes.objectOf(PropTypes.string).isRequired,
};

export default graphql(LOGIN_MUTATION)(observer(withStyles(styles)(Login)));
