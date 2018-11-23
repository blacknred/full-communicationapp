import React from 'react';
import PropTypes from 'prop-types';
import { findIndex, remove } from 'lodash';
import { observer, inject } from 'mobx-react';
import { compose, graphql, Query } from 'react-apollo';

import UpdateChannel from './NewChannel';
import ChannelInfo from '../components/Info';
import ChannelHeaderContent from '../components/ChannelHeader';
import DeleteWarningForm from '../components/WarningForm';

import {
    GET_TEAMS_QUERY,
    GET_TEAM_MEMBERS_QUERY,
} from '../graphql/team';
import {
    STAR_CHANNEL_MUTATION,
    UNSTAR_CHANNEL_MUTATION,
    DELETE_CHANNEL_MUTATION,
} from '../graphql/channel';

class ChannelHeader extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            searchText: '',
            isStarred: false,
            isMenuOpen: false,
            isMobileSearchOpen: false,
            isChannelInfoOpen: false,
            isChannelUpdateFormOpen: false,
            isChannelDeleteWarningFormOpen: false,
        };
    }

    componentDidMount() {
        const { channel: { starred } } = this.props;
        this.setState({ isStarred: starred });
    }

    componentWillReceiveProps(nextProps) {
        const { channel: { starred } } = nextProps;
        this.setState({ isStarred: starred });
    }

    onToggleHandler = target => () => {
        this.setState(prevState => ({
            [target]: !prevState[target],
        }));
    }

    onChangeHandler = ({ target: { name, value } }) => {
        this.setState({ [name]: value });
    }

    onSearchSubmitHandler = () => {
        const { searchText } = this.state;
        console.log(searchText);
    }

    onStarSubmitHandler = async () => {
        const { isStarred } = this.state;
        const {
            channel: { id }, teamIndex, store: { createNotification },
            starChannelMutation, unstarChannelMutation,
        } = this.props;
        const handler = isStarred ? unstarChannelMutation : starChannelMutation;
        try {
            await handler({
                variables: { channelId: id },
                update: (store, { data: { starChannel, unstarChannel } }) => {
                    if (!(starChannel || unstarChannel)) return;
                    const data = store.readQuery({ query: GET_TEAMS_QUERY });
                    const channelIndex = findIndex(data.getTeams[teamIndex].channels, { id });
                    data.getTeams[teamIndex].channels[channelIndex].starred = !isStarred;
                    store.writeQuery({ query: GET_TEAMS_QUERY, data });
                    this.setState({ isStarred: !isStarred });
                },
            });
        } catch (err) {
            createNotification(err.message);
        }
    }

    onDeleteSubmitHandler = async () => {
        const {
            channel: { id: channelId }, teamIndex, deleteChannelMutation,
            store: { createNotification },
        } = this.props;
        try {
            await deleteChannelMutation({
                variables: { channelId },
                update: (store, { data: { deleteChannel } }) => {
                    if (!deleteChannel) return;
                    const data = store.readQuery({ query: GET_TEAMS_QUERY });
                    remove(data.getTeams[teamIndex].channels, ch => ch.id === channelId);
                    store.writeQuery({ query: GET_TEAMS_QUERY, data });
                    this.setState({ isChannelDeleteWarningFormOpen: false });
                    createNotification('Channel was deleted');
                },
            });
        } catch (err) {
            createNotification(err.message);
        }
    }

    render() {
        const {
            store: {
                toggleTeamsSidebar, isChannelSidebarOpen, toggleChannelSidebar,
            }, teamIndex, isOwner, channel, teamId, teamName,
        } = this.props;
        const {
            isStarred, isMenuOpen, isMobileSearchOpen, isChannelInfoOpen,
            isChannelUpdateFormOpen, isChannelDeleteWarningFormOpen, searchText,
        } = this.state;
        return (
            <React.Fragment>
                <ChannelHeaderContent
                    channel={channel}
                    isOwner={isOwner}
                    teamName={teamName}
                    searchText={searchText}
                    isStarred={isStarred}
                    isMenuOpen={isMenuOpen}
                    isMobileSearchOpen={isMobileSearchOpen}
                    isChannelSidebarOpen={isChannelSidebarOpen}
                    onTeamsSidebarToggle={toggleTeamsSidebar}
                    onChannelSidebarToggle={toggleChannelSidebar}
                    onMenuToggle={this.onToggleHandler('isMenuOpen')}
                    onUpdateToggle={this.onToggleHandler('isChannelUpdateFormOpen')}
                    onMobileSearchToggle={this.onToggleHandler('isMobileSearchOpen')}
                    onDeleteToggle={this.onToggleHandler('isChannelDeleteWarningFormOpen')}
                    onInfoToggle={this.onToggleHandler('isChannelInfoOpen')}
                    onChange={this.onChangeHandler}
                    onSearchSubmit={this.onSearchSubmitHandler}
                    onStar={this.onStarSubmitHandler}
                />
                {
                    isChannelUpdateFormOpen && (
                        <UpdateChannel
                            channel={channel}
                            teamId={teamId}
                            teamIndex={teamIndex}
                            onClose={this.onToggleHandler('isChannelUpdateFormOpen')}
                        />
                    )
                }
                {
                    isChannelInfoOpen && (
                        <Query query={GET_TEAM_MEMBERS_QUERY} variables={{ teamId }}>
                            {({ loading, error, data }) => {
                                if (loading || error) return null;
                                return (
                                    <ChannelInfo
                                        onClose={this.onToggleHandler('isChannelInfoOpen')}
                                        options={{
                                            type: channel.dm ? 'Chat' : 'Channel',
                                            name: channel.name,
                                            description: channel.description,
                                            private: channel.private,

                                            membersCount: channel.membersCount,
                                            created_at: channel.created_at,
                                            messagesCount: channel.messagesCount,
                                            filesCount: channel.filesCount,
                                        }}
                                        members={data.getTeamMembers}
                                    />
                                );
                            }}
                        </Query>
                    )
                }
                {
                    isChannelDeleteWarningFormOpen && (
                        <DeleteWarningForm
                            message={`
                            You are deleting ${channel.name.toUpperCase()}
                            ${channel.dm ? 'chat' : 'channel'}.
                            All related messages will be deleted also.
                            `}
                            onSubmit={this.onDeleteSubmitHandler}
                            onClose={this.onToggleHandler('isChannelDeleteWarningFormOpen')}
                        />
                    )
                }

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
    store: PropTypes.shape().isRequired,
    isOwner: PropTypes.bool.isRequired,
    teamId: PropTypes.number.isRequired,
    teamName: PropTypes.string.isRequired,
    teamIndex: PropTypes.number.isRequired,
    starChannelMutation: PropTypes.func.isRequired,
    unstarChannelMutation: PropTypes.func.isRequired,
    deleteChannelMutation: PropTypes.func.isRequired,
};

export default compose(
    graphql(STAR_CHANNEL_MUTATION, { name: 'starChannelMutation' }),
    graphql(UNSTAR_CHANNEL_MUTATION, { name: 'unstarChannelMutation' }),
    graphql(DELETE_CHANNEL_MUTATION, { name: 'deleteChannelMutation' }),
)(inject('store')(observer(ChannelHeader)));
