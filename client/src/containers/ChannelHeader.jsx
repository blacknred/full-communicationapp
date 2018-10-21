import React from 'react';
import { remove } from 'lodash';
import PropTypes from 'prop-types';
import { compose, graphql } from 'react-apollo';

import NewChannelForm from '../components/NewChannelForm';
import OnDeleteWarningForm from '../components/OnDeleteWarningForm';
import ChannelHeaderContent from '../components/ChannelHeaderContent';

import {
    STAR_CHANNEL_MUTATION,
    UNSTAR_CHANNEL_MUTATION,
    UPDATE_CHANNEL_MUTATION,
    DELETE_CHANNEL_MUTATION,
} from '../graphql/channel';
import { GET_TEAMS_QUERY } from '../graphql/team';

class ChannelHeader extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            channelName: '',
            searchText: '',
            errors: {},
            isPrivate: false,
            isStarred: false,
            isMenuOpen: false,
            isMobileSearchOpen: false,
            isDrawerOpen: false,
            isChannelUpdateFormOpen: false,
            isChannelDeleteWarningFormOpen: false,
        };
    }

    componentWillReceiveProps(nextProps) {
        console.log(nextProps);
        const {
            channel: { name: channelName, private: isPrivate }, isStarred,
        } = nextProps;
        this.setState({ channelName, isPrivate, isStarred });
    }

    onToggleHandler = (target) => {
        this.setState(prevState => ({
            [target]: !prevState[target],
        }));
    }

    onChangeHandler = (e) => {
        const { name } = e.target;
        let { value } = e.target;
        if (name === 'isPrivate') value = value === 'true';
        this.setState({ [name]: value });
    }

    onSearchSubmitHandler = () => {
        const { searchText } = this.state;
        console.log(searchText);
    }

    onStarSubmitHandler = async (handler) => {
        const { isStarred } = this.state;
        const { channel, teamIndex } = this.props;
        try {
            await handler({
                variables: { channelId: channel.id },
                update: (store, { data: { starChannel, unstarChannel } }) => {
                    if (!(starChannel || unstarChannel)) return;
                    const data = store.readQuery({ query: GET_TEAMS_QUERY });
                    if (starChannel) {
                        remove(
                            data.getTeams[teamIndex].channels,
                            ch => ch.id === channel.id,
                        );
                        data.getTeams[teamIndex].starredChannels.push(channel);
                    }
                    if (unstarChannel) {
                        remove(
                            data.getTeams[teamIndex].starredChannels,
                            ch => ch.id === channel.id,
                        );
                        data.getTeams[teamIndex].channels.push(channel);
                    }
                    store.writeQuery({ query: GET_TEAMS_QUERY, data });
                    this.setState({ isStarred: !isStarred });
                },
            });
        } catch (err) {
            // TODO:
        }
    }

    onUpdateSubmitHandler = async (handler) => {
        const { channel: { id: channelId }, teamIndex } = this.props;
        try {
            await handler({
                variables: { channelId },
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

    onDeleteSubmitHandler = async (handler) => {
        const { channel: { id: channelId }, teamIndex } = this.props;
        try {
            await handler({
                variables: { channelId },
                update: (store, { data: { deleteChannel } }) => {
                    if (!deleteChannel) return;
                    const data = store.readQuery({ query: GET_TEAMS_QUERY });
                    remove(data.getTeams[teamIndex].channels, ch => ch.id === channelId);
                    store.writeQuery({ query: GET_TEAMS_QUERY, data });
                    this.setState({ isChannelDeleteWarningFormOpen: false });
                },
            });
        } catch (err) {
            // TODO:
        }
    }

    render() {
        const {
            starChannelMutation, unstarChannelMutation,
            updateChannelMutation, deleteChannelMutation,
        } = this.props;
        const {
            channelName, isPrivate, searchText, isStarred,
            errors: { nameError }, isMenuOpen, isMobileSearchOpen,
            isChannelUpdateFormOpen, isChannelDeleteWarningFormOpen,
            isDrawerOpen,
        } = this.state;
        return (
            <React.Fragment>
                <ChannelHeaderContent
                    {...this.props}
                    isMenuOpen={isMenuOpen}
                    isMobileSearchOpen={isMobileSearchOpen}
                    isDrawerOpen={isDrawerOpen}
                    isStarred={isStarred}
                    searchText={searchText}
                    onToggle={this.onToggleHandler}
                    onChange={this.onChangeHandler}
                    onStar={() => this.onStarSubmitHandler(
                        isStarred ? unstarChannelMutation : starChannelMutation,
                    )}
                    onSearchSubmit={this.onSearchSubmitHandler}
                />
                <NewChannelForm
                    open={isChannelUpdateFormOpen}
                    name={channelName}
                    nameError={nameError || ''}
                    isPrivate={isPrivate}
                    onChange={this.onChangeHandler}
                    onSubmit={() => this.onUpdateSubmitHandler(updateChannelMutation)}
                    onClose={() => this.onToggleHandler('isChannelUpdateFormOpen')}
                />
                <OnDeleteWarningForm
                    open={isChannelDeleteWarningFormOpen}
                    message={`
                    You are deleting ${channelName.toUpperCase()} channel.
                    All related messages will be deleted also.
                    `}
                    onSubmit={() => this.onDeleteSubmitHandler(deleteChannelMutation)}
                    onClose={() => this.onToggleHandler('isChannelDeleteWarningFormOpen')}
                />
            </React.Fragment>
        );
    }
}

ChannelHeader.propTypes = {
    channel: PropTypes.shape({
        id: PropTypes.number.isRequired,
        name: PropTypes.string.isRequired,
        private: PropTypes.bool.isRequired,
    }).isRequired,
    isOwner: PropTypes.bool.isRequired,
    isStarred: PropTypes.bool.isRequired,
    teamIndex: PropTypes.number.isRequired,
};

export default compose(
    graphql(STAR_CHANNEL_MUTATION, { name: 'starChannelMutation' }),
    graphql(UNSTAR_CHANNEL_MUTATION, { name: 'unstarChannelMutation' }),
    graphql(UPDATE_CHANNEL_MUTATION, { name: 'updateChannelMutation' }),
    graphql(DELETE_CHANNEL_MUTATION, { name: 'deleteChannelMutation' }),
)(ChannelHeader);
