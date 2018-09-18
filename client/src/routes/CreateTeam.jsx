import React from 'react';
import { observer } from 'mobx-react';
import { graphql } from 'react-apollo';
import { extendObservable } from 'mobx';

import { CREATE_TEAM_MUTATION } from '../graphql/team';

import CreateTeamForm from '../components/CreateTeamForm';

class CreateTeam extends React.Component {
    constructor(props) {
        super(props);
        extendObservable(this, {
            name: '',
            errors: {},
        });
    }

    onChangeHandler = (e) => {
        const { name, value } = e.target;
        this[name] = value;
        this.setState({});
    }

    onSubmitHandler = async (e) => {
        e.preventDefault();
        const { mutate, history } = this.props;
        const { name } = this;
        let res = null;
        try {
            res = await mutate({
                variables: { name },
            });
        } catch (err) {
            history.push('/login');
            return;
        }
        const { ok, errors, team } = res.data.createTeam;
        if (ok) {
            history.push(`/view-team/${team.id}`);
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
        const { name, errors } = this;
        return (
            <CreateTeamForm
                name={name}
                errors={errors}
                onChange={this.onChangeHandler}
                onSubmit={this.onSubmitHandler}
            />
        );
    }
}

export default graphql(CREATE_TEAM_MUTATION)(observer(CreateTeam));
