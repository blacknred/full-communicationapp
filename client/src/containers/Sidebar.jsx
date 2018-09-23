import React from 'react';
import PropTypes from 'prop-types';
import { Mutation } from 'react-apollo';

import {
    ME_QUERY,
    ADD_TEAM_MEMBER_MUTATION,
} from '../graphql/team';
import { CREATE_CHANNEL_MUTATION } from '../graphql/channel';

import TeamsList from '../components/TeamsList';
import ChannelsList from '../components/ChannelsList';
import AddChannelForm from '../components/AddChannelForm';
import InvitePeopleForm from '../components/InvitePeopleForm';

class Sidebar extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            openAddChannelModal: false,
            openInvitePeopleModal: false,
            name: '',
            isPublic: true,
            errors: {},
            email: '',
        };
    }

    onAddChannelToggleHandler = (e) => {
        e.preventDefault();
        this.setState(prevState => ({
            openAddChannelModal: !prevState.openAddChannelModal,
        }));
    }

    onInvitePeopleToggleHandler = (e) => {
        e.preventDefault();
        this.setState(prevState => ({
            openInvitePeopleModal: !prevState.openInvitePeopleModal,
        }));
    }

    onChangeHandler = (e) => {
        e.preventDefault();
        const { name } = e.target;
        let { value } = e.target;
        if (name === 'isPublic') value = value === 'true';
        this.setState({ [name]: value });
    }

    onCreateChannelSubmitHandler = async (handler) => {
        const { team, teamIndex } = this.props;
        const { name, isPublic } = this.state;
        let res = null;
        try {
            res = await handler({
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
                            public: isPublic,
                        },
                        errors: {
                            __typename: 'Error',
                            path: null,
                            message: null,
                        },
                    },
                },
                update: (store, { data: { createChannel } }) => {
                    const { ok, channel } = createChannel;
                    if (!ok) return;
                    const data = store.readQuery({ query: ME_QUERY });
                    data.me.teams[teamIndex].channels.push(channel);
                    store.writeQuery({ query: ME_QUERY, data });
                },
            });
        } catch (err) {
            return;
        }
        const { ok, errors } = res.data.createChannel;
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

    onAddTeamMemberSubmitHandler = async (handler) => {
        const { team } = this.props;
        const { email } = this.state;
        let res = null;
        try {
            res = await handler({
                variables: {
                    email,
                    teamId: team.id,
                },
            });
        } catch (err) {
            return;
        }
        const { ok, errors } = res.data.addTeamMember;
        if (ok) {
            this.setState({ openInvitePeopleModal: false });
        } else {
            const err = {};
            errors.forEach(({ path, message }) => {
                err[`${path}Error`] = message;
            });
            this.setState({ errors: err });
        }
    }

    render() {
        const { teams, team, username } = this.props;
        const {
            openAddChannelModal, openInvitePeopleModal, name, email,
            errors: { nameError, emailError }, isPublic,
        } = this.state;
        return (
            <React.Fragment>
                <TeamsList teams={teams} />
                <ChannelsList
                    teamName={team.name}
                    teamId={team.id}
                    username={username}
                    channels={team.channels}
                    isOwner={team.admin}
                    users={[
                        { id: 1, name: 'Eden Hazard' },
                        { id: 2, name: 'Sadio Mane' },
                    ]}// team.users
                    onAddChannel={this.onAddChannelToggleHandler}
                    onInvitePeople={this.onInvitePeopleToggleHandler}
                />
                <Mutation
                    mutation={CREATE_CHANNEL_MUTATION}
                    ignoreResults
                >
                    {createChannel => (
                        <AddChannelForm
                            open={openAddChannelModal}
                            name={name}
                            nameError={nameError || ''}
                            isPublic={isPublic}
                            onChange={this.onChangeHandler}
                            onSubmit={() => this.onCreateChannelSubmitHandler(createChannel)}
                            onClose={this.onAddChannelToggleHandler}
                        />
                    )}
                </Mutation>
                <Mutation
                    mutation={ADD_TEAM_MEMBER_MUTATION}
                    ignoreResults
                >
                    {addTeamMember => (
                        <InvitePeopleForm
                            open={openInvitePeopleModal}
                            email={email}
                            emailError={emailError || ''}
                            onChange={this.onChangeHandler}
                            onSubmit={() => this.onAddTeamMemberSubmitHandler(addTeamMember)}
                            onClose={this.onInvitePeopleToggleHandler}
                        />
                    )}
                </Mutation>
            </React.Fragment>
        );
    }
}

Sidebar.propTypes = {
    teams: PropTypes.arrayOf(PropTypes.shape).isRequired,
    team: PropTypes.shape({
        id: PropTypes.number.isRequired,
        name: PropTypes.string.isRequired,
        admin: PropTypes.bool.isRequired,
        channels: PropTypes.arrayOf(PropTypes.shape).isRequired,
    }).isRequired,
    teamIndex: PropTypes.number.isRequired,
    username: PropTypes.string.isRequired,
};

export default Sidebar;