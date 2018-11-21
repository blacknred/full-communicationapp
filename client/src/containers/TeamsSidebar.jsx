import React from 'react';
import PropTypes from 'prop-types';
import { observer, inject } from 'mobx-react';
import { compose, graphql } from 'react-apollo';
import { uniqBy, findIndex, remove } from 'lodash';

import {
    GET_TEAMS_QUERY,
    DELETE_TEAM_MUTATION,
} from '../graphql/team';

import Settings from './Settings';
import NewChannel from './NewChannel';
import NewTeamMember from './NewTeamMember';
import TeamsList from '../components/TeamsList';
import TeamHeader from '../components/TeamHeader';
import ChannelsList from '../components/ChannelsList';
import TeamsSidebarContent from '../components/TeamsSidebar';
import DeleteWarningForm from '../components/DeleteWarningForm';

class TeamsSidebar extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isFullTeamsOpen: false,
            isSettingsModalOpen: false,
            isTeamMenuOpen: false,
            isAddChannelModalOpen: false,
            isAddChatModalOpen: false,
            isAllChannelsOpen: false,
            isAllChatsOpen: false,
            isAllStarredOpen: false,
            isInvitePeopleModalOpen: false,
            isTeamUpdateFormOpen: false,
            isTeamDeleteWarningFormOpen: false,
            searchText: '',
            ctxTeams: [],

            starred: [],
            channels: [],
            chats: [],
        };
    }

    componentDidMount() {
        // set context teams for teams sidebar
        const { teams, team } = this.props;
        let teamsWithUpdates = teams.sort((a, b) => b.updatesCount - a.updatesCount);
        teamsWithUpdates = teamsWithUpdates.slice(0, 9);
        this.setState({
            ctxTeams: uniqBy([team, ...teamsWithUpdates], 'id'),

            starred: team.channels.filter(ch => ch.starred),
            channels: team.channels.filter(ch => !ch.dm && !ch.starred),
            chats: team.channels.filter(ch => ch.dm && !ch.starred),
        });
    }

    componentWillReceiveProps({ team }) {
        const { teams, team: oldTeam } = this.props;
        // if the other team was chosen then update context teams list
        if (team.id !== oldTeam.id) {
            let { ctxTeams } = this.state;
            if (teams.length > 10) {
                ctxTeams = ctxTeams.slice(0, 9);
                ctxTeams = uniqBy([team, ...ctxTeams], o => o.id);
            } else {
                const teamIdX = findIndex(ctxTeams, { id: team.id });
                ctxTeams.splice(teamIdX, 1, team);
            }
            this.setState({ ctxTeams });
        } else {
            // in case of updates in current team
            // if there is not new channel chosen then update team channels
            // if (team.channels.length !== oldTeam.channels.length) {
            this.setState({
                starred: team.channels.filter(ch => ch.starred),
                channels: team.channels.filter(ch => !ch.dm && !ch.starred),
                chats: team.channels.filter(ch => ch.dm && !ch.starred),
            });
            // }
        }
    }

    onToggleHandler = target => () => {
        this.setState(prevState => ({
            [target]: !prevState[target],
            errors: {},
            email: '',
        }));
    }

    onChangeHandler = ({ target: { name, value } }) => {
        this.setState({ [name]: value });
    }

    onDeleteTeamSubmitHandler = async () => {
        const {
            team: { id: teamId }, store: { createNotification },
            deleteTeamMutation,
        } = this.props;
        try {
            await deleteTeamMutation({
                variables: { teamId },
                update: (store, { data: { deleteTeam } }) => {
                    if (!deleteTeam) return;
                    const data = store.readQuery({ query: GET_TEAMS_QUERY });
                    remove(data.getTeams, tm => tm.id === teamId);
                    store.writeQuery({ query: GET_TEAMS_QUERY, data });
                    this.setState({ isTeamDeleteWarningFormOpen: false });
                    createNotification('Team was deleted');
                },
            });
        } catch (err) {
            createNotification(err.message);
        }
    }

    render() {
        const {
            teams, team, isOwner, channelId, teamIndex,
            store: { isTeamsSidebarOpen, toggleTeamsSidebar },
        } = this.props;
        const {
            isFullTeamsOpen, isSettingsModalOpen, isInvitePeopleModalOpen,
            isAddChannelModalOpen, isAddChatModalOpen, isAllChannelsOpen,
            isAllChatsOpen, isTeamUpdateFormOpen, isTeamDeleteWarningFormOpen,
            isTeamMenuOpen, isAllStarredOpen,
            searchText, ctxTeams, channels, starred, chats,
        } = this.state;
        const searchedTeams = teams.filter(({ name }) => name.indexOf(searchText) !== -1);
        return (
            <React.Fragment>
                <TeamsSidebarContent
                    isMobileOpen={isTeamsSidebarOpen}
                    isFullTeamsOpen={isFullTeamsOpen}
                    onMobileOpenToggle={toggleTeamsSidebar}
                >
                    <TeamsList
                        teamId={team.id}
                        ctxTeams={ctxTeams}
                        teams={searchedTeams}
                        searchText={searchText}
                        isFullOpen={isFullTeamsOpen}
                        onChange={this.onChangeHandler}
                        onFullToggle={this.onToggleHandler('isFullTeamsOpen')}
                        onSettingsToggle={this.onToggleHandler('isSettingsModalOpen')}
                    />
                    <React.Fragment>
                        <TeamHeader
                            team={team}
                            isMenuOpen={isTeamMenuOpen}
                            onMenuToggle={this.onToggleHandler('isTeamMenuOpen')}
                            onTeamsToggle={this.onToggleHandler('isFullTeamsOpen')}
                            onUpdateToggle={this.onToggleHandler('isTeamUpdateFormOpen')}
                            onDeleteToggle={this.onToggleHandler('isTeamDeleteWarningFormOpen')}
                        />
                        <ChannelsList
                            teamId={team.id}
                            isOwner={isOwner}
                            channelId={channelId}
                            channels={channels}
                            chats={chats}
                            starred={starred}
                            onClick={toggleTeamsSidebar}
                            isAllChatsOpen={isAllChatsOpen}
                            isAllChannelsOpen={isAllChannelsOpen}
                            isAllStarredOpen={isAllStarredOpen}
                            onAllChatsOpen={this.onToggleHandler('isAllChatsOpen')}
                            onAllChannelsOpen={this.onToggleHandler('isAllChannelsOpen')}
                            onAllStarredOpen={this.onToggleHandler('isAllStarredOpen')}
                            onNewToggle={this.onToggleHandler('isAddChannelModalOpen')}
                            onNewDmToggle={this.onToggleHandler('isAddChatModalOpen')}
                            onInviteToggle={this.onToggleHandler('isInvitePeopleModalOpen')}
                        />
                    </React.Fragment>
                </TeamsSidebarContent>
                <Settings
                    open={isSettingsModalOpen}
                    onClose={this.onToggleHandler('isSettingsModalOpen')}
                />
                {
                    isInvitePeopleModalOpen && (
                        <NewTeamMember
                            teamId={team.id}
                            teamIndex={teamIndex}
                            onClose={this.onToggleHandler('isInvitePeopleModalOpen')}
                        />
                    )
                }
                {
                    (isAddChannelModalOpen || isAddChatModalOpen) && (
                        <NewChannel
                            dm={isAddChatModalOpen}
                            teamId={team.id}
                            teamIndex={teamIndex}
                            onClose={
                                isAddChatModalOpen
                                    ? this.onToggleHandler('isAddChatModalOpen')
                                    : this.onToggleHandler('isAddChannelModalOpen')
                            }
                        />
                    )
                }
                {
                    isTeamDeleteWarningFormOpen && (
                        <DeleteWarningForm
                            message={`
                            You are deleting ${team.name.toUpperCase()} team.
                            All related channels and messages will be deleted also.
                            `}
                            onSubmit={this.onDeleteTeamSubmitHandler}
                            onClose={this.onToggleHandler('isTeamDeleteWarningFormOpen')}
                        />
                    )
                }
            </React.Fragment>
        );
    }
}

TeamsSidebar.propTypes = {
    teams: PropTypes.arrayOf(PropTypes.shape).isRequired,
    team: PropTypes.shape({
        id: PropTypes.number.isRequired,
        channels: PropTypes.arrayOf(PropTypes.shape()).isRequired,
    }).isRequired,
    store: PropTypes.shape().isRequired,
    isOwner: PropTypes.bool.isRequired,
    teamIndex: PropTypes.number.isRequired,
    channelId: PropTypes.number.isRequired,
    deleteTeamMutation: PropTypes.func.isRequired,
};

export default compose(
    graphql(DELETE_TEAM_MUTATION, { name: 'deleteTeamMutation' }),
)(inject('store')(observer(TeamsSidebar)));
