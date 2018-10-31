import React from 'react';
import PropTypes from 'prop-types';
// import { withRouter } from 'react-router-dom';
import { observer } from 'mobx-react';
import { uniqBy, remove } from 'lodash';
import { compose, graphql } from 'react-apollo';

import {
    GET_TEAMS_QUERY,
    DELETE_TEAM_MUTATION,
    GET_TEAM_MEMBERS_QUERY,
} from '../graphql/team';

import Settings from './Settings';
import NewChannel from './NewChannel';
import NewTeamMember from './NewTeamMember';
import TeamsSidebarContent from '../components/TeamsSidebar';
import SearchTeamMembersForm from '../components/SearchTeamMembersForm';
import OnDeleteWarningForm from '../components/OnDeleteWarningForm';

class TeamsSidebar extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isMobileOpen: false,
            isFullTeamsOpen: false,
            isSettingsModalOpen: false,
            isTeamMenuOpen: false,
            isAddChannelModalOpen: false,
            isInvitePeopleModalOpen: false,
            isTeamMembersModalOpen: false,
            isTeamDeleteWarningFormOpen: false,
            searchText: '',
            ctxTeams: [],
        };
    }

    componentDidMount() {
        const { teams, team } = this.props;
        this.onResetUpdatesCount();
        // set context teams for teams sidebar
        let teamsWithUpdates = teams.sort((a, b) => b.updatesCount - a.updatesCount);
        teamsWithUpdates = teamsWithUpdates.slice(0, 9);
        const ctxTeams = uniqBy([team, ...teamsWithUpdates], 'id');
        this.setState({ ctxTeams });
    }

    componentWillReceiveProps(nextProps) {
        const { team, channelId } = this.props;
        if (nextProps.channelId !== channelId || nextProps.team.id !== team.id) {
            this.onResetUpdatesCount();
        }
    }

    onResetUpdatesCount = () => {
        const {
            updateQuery, teams, teamIndex, channelIndex,
        } = this.props;
        // updateQuery(() => {
        //     // reset updates' count for current team and channel
        //     teams[teamIndex].updatesCount = 0;
        //     teams[teamIndex].channels[channelIndex].updatesCount = 0;
        //     console.log('updates resetted');
        //     return { getTeams: teams };
        // });
    }

    onUpdateCtxTeamsHandler = (team) => {
        let { ctxTeams } = this.state;
        ctxTeams = ctxTeams.slice(0, 9);
        ctxTeams = uniqBy([team, ...ctxTeams], 'id');
        this.setState({ ctxTeams });
    }

    onToggleHandler = (target) => {
        this.setState(prevState => ({
            [target]: !prevState[target],
            errors: {},
            email: '',
        }));
    }

    onChangeHandler = (e) => {
        const { name, value } = e.target;
        this.setState({ [name]: value });
    }

    onDeleteTeamSubmitHandler = async (handler) => {
        const { team: { id: teamId } } = this.props;
        try {
            await handler({
                variables: { teamId },
                update: (store, { data: { deleteTeam } }) => {
                    if (!deleteTeam) return;
                    const data = store.readQuery({ query: GET_TEAMS_QUERY });
                    remove(data.getTeams, tm => tm.id === teamId);
                    store.writeQuery({ query: GET_TEAMS_QUERY, data });
                    this.setState({ isTeamDeleteWarningFormOpen: false });
                },
            });
        } catch (err) {
            // TODO:
        }
    }

    render() {
        const {
            teams, team, isOwner, channelId, teamIndex, deleteTeamMutation,
        } = this.props;
        const {
            isMobileOpen, isFullTeamsOpen, isAddChannelModalOpen, isTeamMenuOpen,
            isInvitePeopleModalOpen, isTeamMembersModalOpen, isSettingsModalOpen,
            isTeamDeleteWarningFormOpen,
            searchText, ctxTeams,
        } = this.state;
        const searchedTeams = teams.filter(({ name }) => name.indexOf(searchText) !== -1);
        return (
            <React.Fragment>
                <TeamsSidebarContent
                    team={team}
                    isOwner={isOwner}
                    ctxTeams={ctxTeams}
                    channelId={channelId}
                    teams={searchedTeams}
                    searchText={searchText}
                    isMobileOpen={isMobileOpen}
                    isTeamMenuOpen={isTeamMenuOpen}
                    isFullTeamsOpen={isFullTeamsOpen}
                    onChange={this.onChangeHandler}
                    onUpdateCtxTeams={this.onUpdateCtxTeamsHandler}
                    onMobileOpenToggle={() => this.onToggleHandler('isMobileOpen')}
                    onTeamMenuToggle={() => this.onToggleHandler('isTeamMenuOpen')}
                    onFullTeamsToggle={() => this.onToggleHandler('isFullTeamsOpen')}
                    onSettingsToggle={() => this.onToggleHandler('isSettingsModalOpen')}
                    onNewChannelToggle={() => this.onToggleHandler('isAddChannelModalOpen')}
                    onTeamMembersToggle={() => this.onToggleHandler('isTeamMembersModalOpen')}
                    onInvitePeopleToggle={() => this.onToggleHandler('isInvitePeopleModalOpen')}
                    onTeamDeleteToggle={() => this.onToggleHandler('isTeamDeleteWarningFormOpen')}
                />
                <Settings
                    open={isSettingsModalOpen}
                    onClose={() => this.onToggleHandler('isSettingsModalOpen')}
                />
                <NewChannel
                    open={isAddChannelModalOpen}
                    channel={null}
                    teamId={team.id}
                    teamIndex={teamIndex}
                    onClose={() => this.onToggleHandler('isAddChannelModalOpen')}
                />
                <OnDeleteWarningForm
                    open={isTeamDeleteWarningFormOpen}
                    message={`
                    You are deleting ${team.name.toUpperCase()} team.
                    All related channels and messages will be deleted also.
                    `}
                    onSubmit={() => this.onDeleteTeamSubmitHandler(deleteTeamMutation)}
                    onClose={() => this.onToggleHandler('isTeamDeleteWarningFormOpen')}
                />
                <NewTeamMember
                    teamId={team.id}
                    open={isInvitePeopleModalOpen}
                    onClose={() => this.onToggleHandler('isInvitePeopleModalOpen')}
                />

                {/*  */}

                {/* {
                    isTeamMembersModalOpen && (
                        <Query
                            query={GET_TEAM_MEMBERS_QUERY}
                            variables={{ teamId: team.id }}
                        >
                            {({ loading, error, data }) => {
                                if (loading || error) return null;
                                return (
                                    <SearchTeamMembersForm
                                        open={isTeamMembersModalOpen}
                                        currentTeamId={team.id}
                                        onChange={this.onChangeHandler}
                                        onClose={() => this.onToggleHandler('isTeamMembersModalOpen')}
                                        members={
                                            data.teamMembers.map(member => ({
                                                value: member.id,
                                                label: member.username,
                                                online: member.online,
                                            }))
                                        }
                                    />
                                );
                            }}
                        </Query>
                    )
                } */}
            </React.Fragment>
        );
    }
}

TeamsSidebar.propTypes = {
    teams: PropTypes.arrayOf(PropTypes.shape).isRequired,
    team: PropTypes.shape({
        id: PropTypes.number.isRequired,
    }).isRequired,
    isOwner: PropTypes.bool.isRequired,
    teamIndex: PropTypes.number.isRequired,
    channelIndex: PropTypes.number.isRequired,
    channelId: PropTypes.number.isRequired,
    updateQuery: PropTypes.func.isRequired,
    deleteTeamMutation: PropTypes.func.isRequired,
};

export default compose(
    graphql(DELETE_TEAM_MUTATION, { name: 'deleteTeamMutation' }),
)(observer(TeamsSidebar));
