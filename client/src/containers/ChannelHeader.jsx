import React from 'react';
import { remove } from 'lodash';
import PropTypes from 'prop-types';
import { observer } from 'mobx-react';
import { compose, graphql } from 'react-apollo';

import NewChannel from './NewChannel';
import OnDeleteWarningForm from '../components/OnDeleteWarningForm';
import ChannelHeaderContent from '../components/ChannelHeader';

import {
    STAR_CHANNEL_MUTATION,
    UNSTAR_CHANNEL_MUTATION,
    DELETE_CHANNEL_MUTATION,
} from '../graphql/channel';
import { GET_TEAMS_QUERY } from '../graphql/team';

class ChannelHeader extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            searchText: '',
            isStarred: false,
            isMenuOpen: false,
            isMobileSearchOpen: false,
            isDrawerOpen: false,
            isChannelUpdateFormOpen: false,
            isChannelDeleteWarningFormOpen: false,
        };
    }

    componentWillReceiveProps(nextProps) {
        const { isStarred } = nextProps;
        this.setState({ isStarred });
    }

    onToggleHandler = (target) => {
        this.setState(prevState => ({
            [target]: !prevState[target],
        }));
    }

    onChangeHandler = (e) => {
        const { name, value } = e.target;
        this.setState({ [name]: value });
    }

    onSearchSubmitHandler = () => {
        const { searchText } = this.state;
        console.log(searchText);
    }

    onStarSubmitHandler = async (handler) => {
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
                    this.setState(prevState => ({ isStarred: !prevState.isStarred }));
                },
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
        console.log(this.props);
        const {
            starChannelMutation, unstarChannelMutation, deleteChannelMutation,
            channel, teamId, teamIndex, isOwner,
        } = this.props;
        const {
            searchText, isStarred, isMenuOpen, isMobileSearchOpen, isDrawerOpen,
            isChannelUpdateFormOpen, isChannelDeleteWarningFormOpen,
        } = this.state;
        return (
            <React.Fragment>
                <ChannelHeaderContent
                    channel={channel}
                    isOwner={isOwner}
                    searchText={searchText}
                    isStarred={isStarred}
                    isMenuOpen={isMenuOpen}
                    isMobileSearchOpen={isMobileSearchOpen}
                    isDrawerOpen={isDrawerOpen}
                    onToggle={this.onToggleHandler}
                    onChange={this.onChangeHandler}
                    onSearchSubmit={this.onSearchSubmitHandler}
                    onStar={() => this.onStarSubmitHandler(
                        isStarred ? unstarChannelMutation : starChannelMutation,
                    )}
                />
                <NewChannel
                    open={isChannelUpdateFormOpen}
                    channel={channel}
                    teamId={teamId}
                    teamIndex={teamIndex}
                    onClose={() => this.onToggleHandler('isChannelUpdateFormOpen')}
                />
                <OnDeleteWarningForm
                    open={isChannelDeleteWarningFormOpen}
                    message={`
                    You are deleting ${channel.name.toUpperCase()} channel.
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
    teamId: PropTypes.number.isRequired,
    teamIndex: PropTypes.number.isRequired,
    starChannelMutation: PropTypes.func.isRequired,
    unstarChannelMutation: PropTypes.func.isRequired,
    deleteChannelMutation: PropTypes.func.isRequired,
};

export default compose(
    graphql(STAR_CHANNEL_MUTATION, { name: 'starChannelMutation' }),
    graphql(UNSTAR_CHANNEL_MUTATION, { name: 'unstarChannelMutation' }),
    graphql(DELETE_CHANNEL_MUTATION, { name: 'deleteChannelMutation' }),
)(observer(ChannelHeader));
