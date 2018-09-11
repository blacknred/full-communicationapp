import React from 'react';
import gql from 'graphql-tag';
import PropTypes from 'prop-types';
import { observer } from 'mobx-react';
import { extendObservable } from 'mobx';
import { graphql } from 'react-apollo';

import { withStyles } from '@material-ui/core/styles';

import Teams from '../components/Teams';
import Header from '../components/Header';
import Messages from '../components/Messages';
import Channels from '../components/Channels';
import SendMessage from '../components/SendMessage';

const styles = theme => ({
    layout: {
        width: 'auto',
        display: 'block', // Fix IE11 issue.
        marginLeft: theme.spacing.unit * 3,
        marginRight: theme.spacing.unit * 3,
        [theme.breakpoints.up(380 + theme.spacing.unit * 3 * 2)]: {
            width: 380,
            marginLeft: 'auto',
            marginRight: 'auto',
        },
    },
    paper: {
        marginTop: theme.spacing.unit * 8,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        padding: theme.spacing.unit * 4,
    },
    avatar: {
        marginBottom: theme.spacing.unit * 3,
    },
    form: {
        marginTop: theme.spacing.unit * 2,
        width: '100%', // Fix IE11 issue.
        '& > div': {
            marginBottom: theme.spacing.unit * 3,
        },
    },
    submit: {
        margin: `${theme.spacing.unit * 3}px 0`,
    },
});

const CREATE_TEAM_MUTATION = gql`
    mutation ViewTeam($name: String!) {
        ViewTeam(name: $name) {
            ok
            errors {
                path
                message
            }
        }
    }
`;

class ViewTeam extends React.Component {
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
        const { ok, errors } = res.data.ViewTeam;
        if (ok) {
            history.push('/');
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
        return (
            <React.Fragment>
                <Teams
                    teams={[
                        { id: 1, letter: 'B' },
                        { id: 2, letter: 'Q' },
                    ]}
                />
                <Channels
                    teamName="Team name"
                    username="Username"
                    channels={[
                        { id: 1, name: 'General' },
                        { id: 2, name: 'Random' },
                    ]}
                    users={[
                        { id: 1, name: 'Slackbot' },
                        { id: 2, name: 'Mike' },
                    ]}
                />
                <Header channelName="General" />
                <Messages />
                <SendMessage channelName="General" />
            </React.Fragment>
        );
    }
}

ViewTeam.propTypes = {
    // classes: PropTypes.objectOf(PropTypes.string).isRequired,
};

export default graphql(CREATE_TEAM_MUTATION)(observer(withStyles(styles)(ViewTeam)));
