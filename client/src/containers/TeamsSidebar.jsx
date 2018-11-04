import React from 'react';
import PropTypes from 'prop-types';
import { observer } from 'mobx-react';
import { compose, graphql } from 'react-apollo';
import { uniqBy, findIndex, remove } from 'lodash';

import {
    GET_TEAMS_QUERY,
    DELETE_TEAM_MUTATION,
    GET_TEAM_MEMBERS_QUERY,
} from '../graphql/team';

import Settings from './Settings';
import NewChannel from './NewChannel';
import NewTeamMember from './NewTeamMember';
import TeamsSidebarContent from '../components/TeamsSidebar';
import MembersSelectForm from '../components/MembersSelectForm';
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
            isTeamUpdateFormOpen: false,
            isTeamDeleteWarningFormOpen: false,
            searchText: '',
            ctxTeams: [],
        };
    }

    componentDidMount() {
        // set context teams for teams sidebar
        const { teams, team } = this.props;
        let teamsWithUpdates = teams.sort((a, b) => b.updatesCount - a.updatesCount);
        teamsWithUpdates = teamsWithUpdates.slice(0, 9);
        const ctxTeams = uniqBy([team, ...teamsWithUpdates], 'id');
        this.setState({ ctxTeams });
    }

    componentWillReceiveProps(nextProps) {
        // update context teams for teams sidebar
        const { team: newTeam } = nextProps;
        const { teams, team: oldTeam } = this.props;
        if (newTeam.id !== oldTeam.id) {
            let { ctxTeams } = this.state;
            if (teams.length > 10) {
                ctxTeams = ctxTeams.slice(0, 9);
                ctxTeams = uniqBy([newTeam, ...ctxTeams], o => o.id);
            } else {
                const teamIdX = findIndex(ctxTeams, { id: newTeam.id });
                ctxTeams.splice(teamIdX, 1, newTeam);
            }
            this.setState({ ctxTeams });
        }
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
            isTeamUpdateFormOpen, isTeamDeleteWarningFormOpen,
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
                    onMobileOpenToggle={() => this.onToggleHandler('isMobileOpen')}
                    onTeamMenuToggle={() => this.onToggleHandler('isTeamMenuOpen')}
                    onFullTeamsToggle={() => this.onToggleHandler('isFullTeamsOpen')}
                    onSettingsToggle={() => this.onToggleHandler('isSettingsModalOpen')}
                    onNewChannelToggle={() => this.onToggleHandler('isAddChannelModalOpen')}
                    onTeamMembersToggle={() => this.onToggleHandler('isTeamMembersModalOpen')}
                    onInvitePeopleToggle={() => this.onToggleHandler('isInvitePeopleModalOpen')}
                    onTeamUpdateToggle={() => this.onToggleHandler('isTeamUpdateFormOpen')}
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


                {/* <Query
                    query={GET_TEAM_MEMBERS_QUERY}
                    variables={{ teamId: team.id }}
                >
                    {({ loading, error, data }) => {
                        if (loading || error) return null;
                        return (
                            <MembersSelectForm
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
                </Query> */}
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
    channelId: PropTypes.number.isRequired,
    deleteTeamMutation: PropTypes.func.isRequired,
};

export default compose(
    graphql(DELETE_TEAM_MUTATION, { name: 'deleteTeamMutation' }),
)(observer(TeamsSidebar));
