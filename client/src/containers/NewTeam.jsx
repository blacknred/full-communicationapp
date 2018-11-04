import React from 'react';
import { graphql } from 'react-apollo';

import { CREATE_TEAM_MUTATION } from '../graphql/team';

import NewTeamForm from '../components/NewTeamForm';

class NewTeam extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            name: '',
            description: '',
            errors: {},
        };
    }

    onChangeHandler = (e) => {
        const { name, value } = e.target;
        this.setState({ [name]: value });
    }

    onSubmitHandler = async () => {
        const { name, description } = this.state;
        const { mutate, history } = this.props;
        try {
            const {
                data: { createTeam: { ok, errors, team } },
            } = await mutate({
                variables: { name, description },
            });
            if (ok) {
                history.push(`/teams/${team.id}/1`);
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
        return (
            <NewTeamForm
                {...this.state}
                onChange={this.onChangeHandler}
                onSubmit={this.onSubmitHandler}
            />
        );
    }
}

export default graphql(CREATE_TEAM_MUTATION)(NewTeam);
