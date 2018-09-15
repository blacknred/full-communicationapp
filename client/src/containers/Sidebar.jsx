import React from 'react';
import decode from 'jwt-decode';
import PropTypes from 'prop-types';
import { graphql } from 'react-apollo';

import { ALL_TEAMS_QUERY } from '../graphql/team';
import { CREATE_CHANNEL_MUTATION } from '../graphql/channel';

import Teams from '../components/Teams';
import Channels from '../components/Channels';
import AddChannelForm from '../components/AddChannelForm';

class Sidebar extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            openAddChannelModal: false,
            name: '',
            isPublic: false,
            errors: {},
        };
    }

    onAddChannelToggleHandler = () => {
        // this.setState(prevState => ({
        //     openAddChannelModal: !prevState.openAddChannelModal,
        // }));
    }

    onChangeHandler = (target, value) => {
        // this.setState({ [target]: value });
    }

    onSubmitHandler = async (e) => {
        e.preventDefault();
        const { mutate, team, teamIndex } = this.props;
        const { name, isPublic } = this.state;
        let res = null;
        try {
            res = await mutate({
                variables: {
                    teamId: team.id,
                    name,
                    public: isPublic,
                },
                optimisticResponse: {
                    createChannel: {
                        __typename: 'Mutation',
                        ok: true,
                        channel: {
                            __typename: 'Channel',
                            id: -1,
                            name,
                        },
                    },
                },
                update: (store, { data: { createChannel } }) => {
                    const { ok, channel } = createChannel;
                    if (!ok) return;
                    const data = store.readQuery({ query: ALL_TEAMS_QUERY });
                    data.allTeams[teamIndex].channels.push(channel);
                    store.writeQuery({ query: ALL_TEAMS_QUERY, data });
                },
            });
        } catch (err) {
            return;
        }
        const { ok, errors } = res.data.createTeam;
        if (ok) {
            this.setState({ openAddChannelModal: false });
        } else {
            const err = {};
            errors.forEach(({ path, message }) => {
                err[`${path}Error`] = message;
            });
            this.setState({ errors: err });
        }
    }

    render() {
        const { teams, team } = this.props;
        const {
            openAddChannelModal, name, isPublic, errors: { nameError },
        } = this.state;

        const token = localStorage.getItem('token');
        const { user: { username } } = decode(token);

        return (
            <React.Fragment>
                <Teams teams={teams} />
                <Channels
                    teamName={team.name}
                    teamId={team.id}
                    username={username || ''}
                    channels={team.channels}
                    users={[]}// team.users
                    onAddChannel={this.onAddChannelToggleHandler}
                />
                <AddChannelForm
                    open={openAddChannelModal}
                    name={name}
                    nameError={nameError || ''}
                    isPublic={isPublic}
                    onChange={this.onChangeHandler}
                    onSubmit={this.onSubmitHandler}
                    onClose={this.onAddChannelToggleHandler}
                />
            </React.Fragment>
        );
    }
}

Sidebar.propTypes = {
    teams: PropTypes.arrayOf(PropTypes.shape).isRequired,
    team: PropTypes.shape({
        id: PropTypes.number.isRequired,
        name: PropTypes.string.isRequired,
        channels: PropTypes.arrayOf(PropTypes.shape).isRequired,
    }).isRequired,
    teamIndex: PropTypes.number.isRequired,
};

export default graphql(CREATE_CHANNEL_MUTATION)(Sidebar);
