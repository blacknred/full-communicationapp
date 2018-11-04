import React from 'react';
import PropTypes from 'prop-types';
import * as qs from 'query-string';
import { graphql } from 'react-apollo';

import { wsLink } from '../apolloClient';
import { LOGIN_MUTATION } from '../graphql/user';

import LoginForm from '../components/LoginForm';

class Login extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            email: '',
            password: '',
            teamToken: null,
            errors: {},
        };
    }

    componentDidMount() {
        const { location: { search } } = this.props;
        if (search) {
            const { token, email = '' } = qs.parse(search);
            this.setState({ teamToken: token, email });
        }
    }

    onChangeHandler = (e) => {
        const { name, value } = e.target;
        this.setState({ [name]: value });
    }

    onSubmitHandler = async () => {
        const { history, mutate } = this.props;
        const { email, password, teamToken } = this.state;
        try {
            const {
                data: {
                    login: {
                        ok, token, refreshToken, errors,
                    },
                },
            } = await mutate({
                variables: { email, password, teamToken },
            });
            if (ok) {
                localStorage.setItem('token', token);
                localStorage.setItem('refreshToken', refreshToken);
                wsLink.subscriptionClient.tryReconnect();
                history.push('/teams');
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
        const { location: { search } } = this.props;
        const { email, password, errors } = this.state;
        return (
            <LoginForm
                email={email}
                password={password}
                errors={errors}
                token={search}
                onChange={this.onChangeHandler}
                onSubmit={this.onSubmitHandler}
            />
        );
    }
}

Login.propTypes = {
    location: PropTypes.shape({
        search: PropTypes.string,
    }).isRequired,
};

export default graphql(LOGIN_MUTATION)(Login);
