import React from 'react';
import { graphql } from 'react-apollo';

import { CREATE_TEAM_MUTATION } from '../graphql/team';

import CreateTeamForm from '../components/CreateTeamForm';

class CreateTeam extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            name: '',
            errors: {},
        };
    }

    onChangeHandler = (e) => {
        const { name, value } = e.target;
        this.setState({ [name]: value });
    }

    onSubmitHandler = async (e) => {
        e.preventDefault();
        const { mutate, history } = this.props;
        const { name } = this.state;
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
            history.push(`/teams/${team.id}`);
        } else {
            const err = {};
            errors.forEach(({ path, message }) => {
                err[`${path}Error`] = message;
            });
            this.setState({ errors: err });
        }
    }

    render() {
        const { name, errors } = this.state;
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

export default graphql(CREATE_TEAM_MUTATION)(CreateTeam);
