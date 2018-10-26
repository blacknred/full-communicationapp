import React from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import { graphql, compose } from 'react-apollo';

import {
    CREATE_CHANNEL_MUTATION,
    UPDATE_CHANNEL_MUTATION,
} from '../graphql/channel';
import { GET_TEAMS_QUERY } from '../graphql/team';

import NewChannelForm from '../components/NewChannelForm';

class NewChannel extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isUpdate: false,
            id: null,
            name: '',
            description: '',
            private: false,
            errors: {},
            members: [],
        };
    }

    componentDidMount() {
        const { channel } = this.props;
        if (channel) {
            this.setState({ ...channel, isUpdate: true });
        }
    }

    componentWillReceiveProps(nextProps) {
        const { channel } = this.props;
        if (channel && (channel.id !== nextProps.channel.id)) {
            this.setState({ ...nextProps.channel, isUpdate: true });
        }
    }

    onChangeHandler = (e) => {
        const { name, value } = e.target;
        this.setState({ [name]: value });
    }

    onCreateHandler = async () => {
        const {
            name, description, private: isPrivate, members,
        } = this.state;
        const {
            teamId, teamIndex, history, onClose, createChannelMutation,
        } = this.props;
        try {
            const res = await createChannelMutation({
                variables: {
                    teamId,
                    name,
                    description,
                    private: isPrivate,
                    members,
                },
                optimisticResponse: {
                    createChannel: {
                        __typename: 'Mutation',
                        ok: true,
                        channel: {
                            __typename: 'Channel',
                            id: -1,
                            name,
                            description,
                            private: isPrivate,
                            dm: members.length > 0,
                            updatesCount: 0,
                            participantsCount: 1,
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
                    const data = store.readQuery({ query: GET_TEAMS_QUERY });
                    data.getTeams[teamIndex].channels.push(channel);
                    store.writeQuery({ query: GET_TEAMS_QUERY, data });
                },
            });
            const { ok, channel, errors } = res.data.createChannel;
            if (ok) {
                onClose();
                history.push(`/teams/${teamId}/${channel.id}`);
            } else {
                const err = {};
                errors.forEach(({ path, message }) => {
                    err[`${path}Error`] = message;
                });
                this.setState({ errors: err });
            }
        } catch (err) {
            // TODO:
        }
    }

    onUpdateHandler = async () => {
        const { updateChannelMutation } = this.props;
        const { id } = this.state;
        try {
            await updateChannelMutation({
                variables: { channelId: id },
                // optimisticResponse: {
                //     createChannel: {
                //         __typename: 'Mutation',
                //         ok: true,
                //         channel: {
                //             __typename: 'Channel',
                //             id: -1,
                //             name: channelName,
                //             private: isPrivate,
                //             dm: members.length > 0,
                //         },
                //         errors: {
                //             __typename: 'Error',
                //             path: null,
                //             message: null,
                //         },
                //     },
                // },
                // update: (store, { data: { deleteChannel } }) => {
                //     if (!deleteChannel) return;
                //     const data = store.readQuery({ query: GET_TEAMS_QUERY });
                //     remove(data.getTeams[teamIndex].channels, ch => ch.id === channelId);
                //     store.writeQuery({ query: GET_TEAMS_QUERY, data });
                //     this.setState({ isChannelDeleteWarningFormOpen: false });
                // },
            });
        } catch (err) {
            // TODO:
        }
    }

    render() {
        const { isUpdate } = this.state;
        const { open, onClose } = this.props;
        return (
            <NewChannelForm
                {...this.state}
                open={open}
                onChange={this.onChangeHandler}
                onSubmit={isUpdate ? this.onUpdateHandler : this.onCreateHandler}
                onClose={onClose}
            />
        );
    }
}

NewChannel.propTypes = {
    open: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    channel: PropTypes.shape({
        id: PropTypes.number.isRequired,
        name: PropTypes.string.isRequired,
        private: PropTypes.bool.isRequired,
        description: PropTypes.any,
        updatesCount: PropTypes.number.isRequired,
    }),
    createChannelMutation: PropTypes.func.isRequired,
    updateChannelMutation: PropTypes.func.isRequired,
};

export default compose(
    graphql(CREATE_CHANNEL_MUTATION, { name: 'createChannelMutation' }),
    graphql(UPDATE_CHANNEL_MUTATION, { name: 'updateChannelMutation' }),
)(withRouter(NewChannel));
