import React from 'react';
import { graphql } from 'react-apollo';

import { REGISTER_MUTATION } from '../graphql/user';

import RegisterForm from '../components/RegisterForm';

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

    onSubmitHandler = async () => {
        const { history, mutate } = this.props;
        const { username, email, password } = this.state;
        try {
            const {
                data: { register: { ok, errors } },
            } = await mutate({
                variables: { username, email, password },
            });
            if (ok) {
                history.push('/login');
            } else {
                const err = {};
                errors.forEach(({ path, message }) => {
                    err[`${path}Error`] = message;
                });
                this.setState({ errors: err });
            }
        } catch (err) {
            // TODO:
        }
    }

    render() {
        const {
            username, email, password, errors,
        } = this.state;
        return (
            <RegisterForm
                username={username}
                email={email}
                password={password}
                errors={errors}
                onChange={this.onChangeHandler}
                onSubmit={this.onSubmitHandler}
            />
        );
    }
}

export default graphql(REGISTER_MUTATION)(Register);
