import React from 'react';
import PropTypes from 'prop-types';
import { graphql } from 'react-apollo';
import { observer, inject } from 'mobx-react';

import {
    GET_TEAMS_QUERY,
    ADD_TEAM_MEMBER_MUTATION,
} from '../graphql/team';

import TeamMemberForm from '../components/TeamMemberForm';

class NewTeamMember extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            email: '',
            errors: {},
        };
    }

    onChangeHandler = ({ target: { name, value } }) => {
        this.setState({ [name]: value });
    }

    onSubmitHandler = async () => {
        const { email } = this.state;
        const {
            teamId, teamIndex, mutate, onClose,
            store: { createNotification },
        } = this.props;
        try {
            const {
                data: { addTeamMember: { ok, errors, status } },
            } = await mutate({
                variables: {
                    teamId,
                    email,
                },
                update: (store, { data: { addTeamMember: { ok: isOk } } }) => {
                    if (!isOk) return;
                    const data = store.readQuery({ query: GET_TEAMS_QUERY });
                    data.getTeams[teamIndex].membersCount += 1;
                    store.writeQuery({ query: GET_TEAMS_QUERY, data });
                },
            });
            if (ok) {
                onClose();
                this.setState({
                    email: '',
                    errors: {},
                });
                createNotification(status);
            } else {
                const err = {};
                errors.forEach(({ path, message }) => {
                    err[`${path}Error`] = message;
                });
                this.setState({ errors: err });
            }
        } catch (err) {
            createNotification(err.message);
        }
    }

    render() {
        const { email, errors: { emailError } } = this.state;
        const { onClose } = this.props;
        return (
            <TeamMemberForm
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
    teamIndex: PropTypes.number.isRequired,
    onClose: PropTypes.func.isRequired,
};

export default graphql(ADD_TEAM_MEMBER_MUTATION)(
    inject('store')(observer(NewTeamMember)),
);
