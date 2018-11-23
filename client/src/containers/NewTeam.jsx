import React from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import { observer, inject } from 'mobx-react';
import { graphql, compose } from 'react-apollo';

import {
    GET_TEAMS_QUERY,
    CREATE_TEAM_MUTATION,
    UPDATE_TEAM_MUTATION,
} from '../graphql/team';

import TeamForm from '../components/TeamForm';

class NewTeam extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isUpdate: false,
            name: '',
            description: '',
            errors: {},
        };
    }

    componentDidMount() {
        const { team } = this.props;
        if (team) {
            this.setState({ ...team, isUpdate: true });
        }
    }

    onChangeHandler = ({ target: { name, value } }) => {
        this.setState({ [name]: value });
    }

    onCreateHandler = async () => {
        const { name, description } = this.state;
        const {
            history, store: { createNotification }, createTeamMutation,
        } = this.props;
        try {
            const {
                data: {
                    createTeam: { ok, team, errors },
                },
            } = await createTeamMutation({
                variables: { name, description },
                update: (store, { data: { createTeam: { ok: isOk, team: newTeam } } }) => {
                    if (!isOk) return;
                    const data = store.readQuery({ query: GET_TEAMS_QUERY });
                    data.getTeams.push(newTeam);
                    store.writeQuery({ query: GET_TEAMS_QUERY, data });
                },
            });
            if (ok) {
                createNotification(`team ${name} was created`);
                history.push(`/teams/${team.id}/1`);
            } else {
                const err = {};
                errors.forEach(({ path, message }) => {
                    err[`${path}Error`] = message;
                });
                this.setState({ errors: err });
            }
        } catch (err) {
            createNotification(err.message);
            history.push('/login');
        }
    }

    onUpdateHandler = async () => {
        const { name, description } = this.state;
        const {
            history, store: { createNotification }, updateTeamMutation,
            teamIndex, team: { id }, onClose,
        } = this.props;
        try {
            const {
                data: {
                    updateTeam: { ok, errors },
                },
            } = await updateTeamMutation({
                variables: { teamId: id, name, description },
                update: (store, { data: { updateTeam: { ok: isOk, team } } }) => {
                    if (!isOk) return;
                    const data = store.readQuery({ query: GET_TEAMS_QUERY });
                    const props = data.getTeams[teamIndex];
                    data.getTeams[teamIndex] = { ...props, ...team };
                    store.writeQuery({ query: GET_TEAMS_QUERY, data });
                },
            });
            if (ok) {
                onClose();
                createNotification(`team ${name} was updated`);
                history.push(`/teams/${id}/1`);
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
        const { isUpdate } = this.state;
        const { onClose } = this.props;
        return (
            <TeamForm
                {...this.state}
                onClose={onClose}
                onChange={this.onChangeHandler}
                onSubmit={isUpdate ? this.onUpdateHandler : this.onCreateHandler}
            />
        );
    }
}

NewTeam.propTypes = {
    team: PropTypes.shape({
        id: PropTypes.number.isRequired,
    }),
    teamIndex: PropTypes.number,
    onClose: PropTypes.func,
};

export default compose(
    graphql(CREATE_TEAM_MUTATION, { name: 'createTeamMutation' }),
    graphql(UPDATE_TEAM_MUTATION, { name: 'updateTeamMutation' }),
)(inject('store')(observer(withRouter(NewTeam))));
