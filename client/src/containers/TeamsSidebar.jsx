import React from 'react';
import { uniqBy } from 'lodash';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import { Mutation, Query } from 'react-apollo';

import {
    GET_TEAM_MEMBERS_QUERY,
    ADD_TEAM_MEMBER_MUTATION,
} from '../graphql/team';

import Settings from './Settings';
import TeamsSidebarContent from '../components/TeamSidebar';
import NewChannel from './NewChannel';
import InvitePeopleForm from '../components/InvitePeopleForm';
import SearchTeamMembersForm from '../components/SearchTeamMembersForm';

class TeamsSidebar extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isSidebarOpen: false,
            isFullTeamsModeOpen: false,
            isSettingsModalOpen: false,
            isAddChannelModalOpen: false,
            isInvitePeopleModalOpen: false,
            isSearchTeamMembersModalOpen: false,
            ctxTeams: [],

            email: '',
            searchText: '',
            errors: {},
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

    onAddTeamMemberSubmitHandler = async (handler) => {
        const { team } = this.props;
        const { email } = this.state;
        try {
            const {
                data: { addTeamMember: { ok, errors } },
            } = await handler({
                variables: {
                    email,
                    teamId: team.id,
                },
            });
            if (ok) {
                this.setState({ isInvitePeopleModalOpen: false });
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

    render() {
        const {
            teams, team, isOwner, channelId, teamIndex,
        } = this.props;
        const {
            isSidebarOpen, isFullTeamsModeOpen, isAddChannelModalOpen,
            isInvitePeopleModalOpen, isSearchTeamMembersModalOpen,
            isSettingsModalOpen, searchText, email,
            ctxTeams, errors: { emailError },
        } = this.state;
        const searchedTeams = teams.filter(({ name }) => name.indexOf(searchText) !== -1);
        return (
            <React.Fragment>
                <TeamsSidebarContent
                    teams={searchedTeams}
                    ctxTeams={ctxTeams}
                    team={team}
                    isOwner={isOwner}
                    isOpen={isSidebarOpen}
                    searchText={searchText}
                    channelId={channelId}
                    onToggle={this.onToggleHandler}
                    onChange={this.onChangeHandler}
                    onUpdateCtxTeams={this.onUpdateCtxTeamsHandler}
                    isFullTeamsModeOpen={isFullTeamsModeOpen}
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


                {/*  */}


                <Mutation
                    mutation={ADD_TEAM_MEMBER_MUTATION}
                    ignoreResults
                >
                    {addTeamMember => (
                        <InvitePeopleForm
                            open={isInvitePeopleModalOpen}
                            email={email}
                            emailError={emailError || ''}
                            onChange={this.onChangeHandler}
                            onSubmit={() => this.onAddTeamMemberSubmitHandler(addTeamMember)}
                            onClose={this.onToggleHandler}
                        />
                    )}
                </Mutation>
                {
                    isSearchTeamMembersModalOpen && (
                        <Query
                            query={GET_TEAM_MEMBERS_QUERY}
                            variables={{ teamId: team.id }}
                        >
                            {({ loading, error, data }) => {
                                if (loading || error) return null;
                                return (
                                    <SearchTeamMembersForm
                                        open={isSearchTeamMembersModalOpen}
                                        currentTeamId={team.id}
                                        onChange={this.onChangeHandler}
                                        onClose={this.onToggleHandler}
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
                }
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
};

export default withRouter(TeamsSidebar);
