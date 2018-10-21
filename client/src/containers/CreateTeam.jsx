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

    onSubmitHandler = async () => {
        const { name } = this.state;
        const { mutate, history } = this.props;
        try {
            const {
                data: { createTeam: { ok, errors, team } },
            } = await mutate({
                variables: { name },
            });
            if (ok) {
                history.push(`/teams/${team.id}`);
            } else {
                const err = {};
                errors.forEach(({ path, message }) => {
                    err[`${path}Error`] = message;
                });
                this.setState({ errors: err });
            }
        } catch (err) {
            history.push('/login');
            // TODO:
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
