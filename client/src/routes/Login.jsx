import React from 'react';
import { observer } from 'mobx-react';
import { extendObservable } from 'mobx';
import { graphql } from 'react-apollo';

import { LOGIN_MUTATION } from '../graphql/user';

import LoginForm from '../components/LoginForm';

class Login extends React.Component {
    constructor(props) {
        super(props);

        extendObservable(this, {
            email: '',
            password: '',
            errors: {},
        });
    }

    onChangeHandler = (e) => {
        const { name, value } = e.target;
        this[name] = value;
    }

    onSubmitHandler = async (e) => {
        e.preventDefault();
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
            history.push('/');
        } else {
            const err = {};
            errors.forEach(({ path, message }) => {
                err[`${path}Error`] = message;
            });
            this.errors = err;
            this.setState({});
        }
    }

    render() {
        const { email, password, errors } = this;
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

export default graphql(LOGIN_MUTATION)(observer(Login));
