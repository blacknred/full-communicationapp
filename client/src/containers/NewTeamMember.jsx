import React from 'react';
import PropTypes from 'prop-types';
import { graphql } from 'react-apollo';

import {
    ADD_TEAM_MEMBER_MUTATION,
} from '../graphql/team';

import NewTeamMemberForm from '../components/NewTeamMemberForm';

class NewTeamMember extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            email: '',
            errors: {},
        };
    }

    onChangeHandler = (e) => {
        const { name, value } = e.target;
        this.setState({ [name]: value });
    }

    onSubmitHandler = async () => {
        const { email } = this.state;
        const { teamId, mutate, onClose } = this.props;
        try {
            const {
                data: { addTeamMember: { ok, errors, status } },
            } = await mutate({
                variables: {
                    teamId,
                    email,
                },
            });
            if (ok) {
                onClose();
                this.setState({
                    email: '',
                    errors: {},
                });
                // TODO:
                console.log(status);
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
        const { email, errors: { emailError } } = this.state;
        const { open, onClose } = this.props;
        return (
            <NewTeamMemberForm
                open={open}
                email={email}
                emailError={emailError || ''}
                onChange={this.onChangeHandler}
                onSubmit={this.onSubmitHandler}
                onClose={onClose}
            />
        );
    }
}

NewTeamMember.propTypes = {
    teamId: PropTypes.number.isRequired,
    open: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
};

export default graphql(ADD_TEAM_MEMBER_MUTATION)(NewTeamMember);
