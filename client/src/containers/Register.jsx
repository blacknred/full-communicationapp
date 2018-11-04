import React from 'react';
import PropTypes from 'prop-types';
import * as qs from 'query-string';
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
        const {
            username, email, password, teamToken,
        } = this.state;
        try {
            const {
                data: { register: { ok, errors } },
            } = await mutate({
                variables: {
                    username, email, password, teamToken,
                },
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
        const { location: { search } } = this.props;
        const {
            username, email, password, errors,
        } = this.state;
        return (
            <RegisterForm
                username={username}
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

Register.propTypes = {
    location: PropTypes.shape({
        search: PropTypes.string,
    }).isRequired,
};

export default graphql(REGISTER_MUTATION)(Register);
