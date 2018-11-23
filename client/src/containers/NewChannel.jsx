import React from 'react';
import PropTypes from 'prop-types';
import { findIndex } from 'lodash';
import { withRouter } from 'react-router-dom';
import { observer, inject } from 'mobx-react';
import { graphql, compose } from 'react-apollo';

import {
    GET_CHANNEL_MEMBERS_QUERY,
    CREATE_CHANNEL_MUTATION,
    UPDATE_CHANNEL_MUTATION,
    CREATE_DM_CHANNEL_MUTATION,
} from '../graphql/channel';
import {
    GET_TEAMS_QUERY,
    GET_TEAM_MEMBERS_QUERY,
} from '../graphql/team';

import ChannelForm from '../components/ChannelForm';

class NewChannel extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isUpdate: false,
            id: null,
            name: '',
            description: '',
            private: false,
            members: [],
            errors: {},
        };
    }

    componentDidMount() {
        const { channel } = this.props;
        if (channel) {
            this.setState({ ...channel, isUpdate: true });
        }
    }

    componentWillReceiveProps({ getChannelMembersQuery }) {
        if (getChannelMembersQuery && getChannelMembersQuery.getChannelMembers) {
            const { getChannelMembers } = getChannelMembersQuery;
            this.setState({ members: getChannelMembers.map(ch => ch.id) });
        }
    }

    onChangeHandler = ({ target: { name, value } }) => {
        if (name === 'private') {
            this.setState({ [name]: value === 'true' });
        } else {
            this.setState({ [name]: value });
        }
    }

    onCreateChannelHandler = async () => {
        const {
            name, description, private: isPrivate, members,
        } = this.state;
        const {
            teamId, teamIndex, onClose, createChannelMutation,
            history, store: { createNotification },
        } = this.props;
        try {
            const {
                data: {
                    createChannel: { ok, channel, errors },
                },
            } = await createChannelMutation({
                variables: {
                    teamId,
                    name,
                    description,
                    private: isPrivate,
                    members,
                },
                update: (store, { data: { createChannel } }) => {
                    const { ok: isOk, channel: newChannel } = createChannel;
                    if (!isOk) return;
                    const data = store.readQuery({ query: GET_TEAMS_QUERY });
                    data.getTeams[teamIndex].channels.push(newChannel);
                    store.writeQuery({ query: GET_TEAMS_QUERY, data });
                },
            });
            if (ok) {
                onClose();
                createNotification(`channel ${name} was created`);
                history.push(`/teams/${teamId}/${channel.id}`);
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

    onCreateChatHandler = async () => {
        const { members } = this.state;
        const {
            teamId, teamIndex, store: { createNotification },
            createDMChannelMutation, onClose, history,
        } = this.props;
        try {
            const {
                data: { createDMChannel: { id } },
            } = await createDMChannelMutation({
                variables: {
                    teamId,
                    members,
                },
                update: (store, { data: { createDMChannel } }) => {
                    const { id: channelId, name } = createDMChannel;
                    const data = store.readQuery({ query: GET_TEAMS_QUERY });
                    const notInChannelsList = data.getTeams[teamIndex].channels
                        .every(c => c.id !== channelId);
                    if (notInChannelsList) {
                        data.getTeams[teamIndex].channels.push(createDMChannel);
                        store.writeQuery({ query: GET_TEAMS_QUERY, data });
                        createNotification(`Chat with ${name} was created`);
                    } else {
                        createNotification(`Chat with ${name} already exists`);
                    }
                },
            });
            onClose();
            history.push(`/teams/${teamId}/${id}`);
        } catch (err) {
            createNotification(err.message);
        }
    }

    onUpdateHandler = async () => {
        const {
            id, name, description, private: isPrivate, members,
        } = this.state;
        const {
            onClose, updateChannelMutation, store: { createNotification },
            teamIndex,
        } = this.props;
        try {
            const {
                data: {
                    updateChannel: { ok, errors },
                },
            } = await updateChannelMutation({
                variables: {
                    channelId: id,
                    name,
                    description,
                    private: isPrivate,
                    members,
                },
                update: (store, { data: { updateChannel: { ok: isOk, channel } } }) => {
                    if (!isOk) return;
                    const data = store.readQuery({ query: GET_TEAMS_QUERY });
                    const channelIndex = findIndex(data.getTeams[teamIndex].channels, { id });
                    const props = data.getTeams[teamIndex].channels[channelIndex];
                    data.getTeams[teamIndex].channels[channelIndex] = { ...props, ...channel };
                    store.writeQuery({ query: GET_TEAMS_QUERY, data });
                    this.setState({ isChannelDeleteWarningFormOpen: false });
                },
            });
            if (ok) {
                onClose();
                createNotification(`channel ${name} was updated`);
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
        const { isUpdate, members, ...args } = this.state;
        const {
            getTeamMembersQuery: { loading, error, getTeamMembers }, onClose, dm,
        } = this.props;
        if (loading || error) return null;
        return (
            <ChannelForm
                {...args}
                dm={dm || false}
                onClose={onClose}
                isUpdate={isUpdate}
                members={getTeamMembers.filter(m => members.includes(m.id))}
                teamMembers={getTeamMembers}
                onChange={this.onChangeHandler}
                onSubmit={
                    // eslint-disable-next-line no-nested-ternary
                    isUpdate
                        ? this.onUpdateHandler
                        : dm
                            ? this.onCreateChatHandler
                            : this.onCreateChannelHandler
                }
            />
        );
    }
}

NewChannel.propTypes = {
    teamId: PropTypes.number.isRequired,
    onClose: PropTypes.func.isRequired,
    dm: PropTypes.bool,
    channel: PropTypes.shape({
        id: PropTypes.number.isRequired,
        name: PropTypes.string.isRequired,
        private: PropTypes.bool.isRequired,
        description: PropTypes.any,
        updatesCount: PropTypes.number.isRequired,
    }),
};

export default compose(
    graphql(CREATE_CHANNEL_MUTATION, { name: 'createChannelMutation' }),
    graphql(CREATE_DM_CHANNEL_MUTATION, { name: 'createDMChannelMutation' }),
    graphql(UPDATE_CHANNEL_MUTATION, { name: 'updateChannelMutation' }),
    graphql(GET_TEAM_MEMBERS_QUERY, {
        name: 'getTeamMembersQuery',
        options: props => ({
            variables: { teamId: props.teamId },
            fetchPolicy: 'network-only',
        }),
    }),
    graphql(GET_CHANNEL_MEMBERS_QUERY, {
        name: 'getChannelMembersQuery',
        skip: ({ channel }) => !channel,
        options: ({ channel: { id } }) => ({
            variables: { channelId: id },
            fetchPolicy: 'network-only',
        }),
    }),
)(inject('store')(observer(withRouter(NewChannel))));
