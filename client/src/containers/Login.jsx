import React from 'react';
import { graphql } from 'react-apollo';

import { LOGIN_MUTATION } from '../graphql/user';

import LoginForm from '../components/LoginForm';

class Login extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
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
        const { email, password } = this.state;
        const res = await mutate({
            variables: { email, password },
        });
        const {
            ok, token, refreshToken, errors,
        } = res.data.login;
        if (ok) {
            localStorage.setItem('token', token);
            localStorage.setItem('refreshToken', refreshToken);
            history.push('/teams');
        } else {
            const err = {};
            errors.forEach(({ path, message }) => {
                err[`${path}Error`] = message;
            });
            this.setState({ errors: err });
        }
    }

    render() {
        const { email, password, errors } = this.state;
        return (
            <LoginForm
                email={email}
                password={password}
                errors={errors}
                onChange={this.onChangeHandler}
                onSubmit={this.onSubmitHandler}
            />
        );
    }
}

export default graphql(LOGIN_MUTATION)(Login);
