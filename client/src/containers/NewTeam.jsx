import React from 'react';
import { graphql } from 'react-apollo';
import { observer, inject } from 'mobx-react';

import {
    GET_TEAMS_QUERY,
    CREATE_TEAM_MUTATION,
} from '../graphql/team';

import TeamForm from '../components/TeamForm';

class NewTeam extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            name: '',
            description: '',
            errors: {},
        };
    }

    onChangeHandler = ({ target: { name, value } }) => {
        this.setState({ [name]: value });
    }

    onSubmitHandler = async () => {
        const { name, description } = this.state;
        const {
            mutate, history, store: { createNotification },
        } = this.props;
        try {
            const res = await mutate({
                variables: { name, description },
                update: (store, { data: { createTeam } }) => {
                    const { ok, team } = createTeam;
                    if (!ok) return;
                    const data = store.readQuery({ query: GET_TEAMS_QUERY });
                    data.getTeams.push(team);
                    store.writeQuery({ query: GET_TEAMS_QUERY, data });
                },
            });
            const { ok, team, errors } = res.data.createTeam;
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

    render() {
        return (
            <TeamForm
                {...this.state}
                onChange={this.onChangeHandler}
                onSubmit={this.onSubmitHandler}
            />
        );
    }
}

export default graphql(CREATE_TEAM_MUTATION)(
    inject('store')(observer(NewTeam)),
);
