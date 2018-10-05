import React from 'react';
import PropTypes from 'prop-types';
import { Mutation, Query } from 'react-apollo';

import {
    ME_QUERY,
    TEAM_MEMBERS_QUERY,
    ADD_TEAM_MEMBER_MUTATION,
} from '../graphql/team';
import { CREATE_CHANNEL_MUTATION } from '../graphql/channel';

import SidebarContent from '../components/SidebarContent';
import AddChannelForm from '../components/AddChannelForm';
import InvitePeopleForm from '../components/InvitePeopleForm';
import SearchTeamMembersForm from '../components/SearchTeamMembersForm';

class Sidebar extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isFullTeamsModeOpen: false,
            isSidebarOpen: false,
            isAddChannelModalOpen: false,
            isInvitePeopleModalOpen: false,
            isSearchTeamMembersModalOpen: false,
            channelName: '',
            isPublic: true,
            errors: {},
            email: '',
        };
    }

    onToggleHandler = (target) => {
        this.setState(prevState => ({
            [target]: !prevState[target],
            channelName: '',
            isPublic: true,
            errors: {},
            email: '',
        }));
    }

    onChangeHandler = (e) => {
        const { name } = e.target;
        let { value } = e.target;
        if (name === 'isPublic') value = value === 'true';
        this.setState({ [name]: value });
    }

    onCreateChannelSubmitHandler = async (handler) => {
        const { team, teamIndex } = this.props;
        const { channelName, isPublic } = this.state;
        let res = null;
        try {
            res = await handler({
                variables: {
                    teamId: team.id,
                    name: channelName,
                    public: isPublic,
                },
                optimisticResponse: {
                    createChannel: {
                        __typename: 'Mutation',
                        ok: true,
                        channel: {
                            __typename: 'Channel',
                            id: -1,
                            name: channelName,
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
            this.setState({ isAddChannelModalOpen: false });
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
            this.setState({ isInvitePeopleModalOpen: false });
        } else {
            const err = {};
            errors.forEach(({ path, message }) => {
                err[`${path}Error`] = message;
            });
            this.setState({ errors: err });
        }
    }

    render() {
        const { teams, team, isOwner } = this.props;
        const {
            isSidebarOpen, isFullTeamsModeOpen, isAddChannelModalOpen,
            isInvitePeopleModalOpen, isSearchTeamMembersModalOpen, channelName,
            email, isPublic, errors: { nameError, emailError },
        } = this.state;
        return (
            <React.Fragment>
                <SidebarContent
                    teams={teams}
                    team={team}
                    isOwner={isOwner}
                    isOpen={isSidebarOpen}
                    onToggle={this.onToggleHandler}
                    isFullTeamsModeOpen={isFullTeamsModeOpen}
                />
                <Mutation
                    mutation={CREATE_CHANNEL_MUTATION}
                    ignoreResults
                >
                    {createChannel => (
                        <AddChannelForm
                            open={isAddChannelModalOpen}
                            channelName={channelName}
                            nameError={nameError || ''}
                            isPublic={isPublic}
                            onChange={this.onChangeHandler}
                            onSubmit={() => this.onCreateChannelSubmitHandler(createChannel)}
                            onClose={this.onToggleHandler}
                        />
                    )}
                </Mutation>
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
                            query={TEAM_MEMBERS_QUERY}
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

Sidebar.propTypes = {
    teams: PropTypes.arrayOf(PropTypes.shape).isRequired,
    team: PropTypes.shape({
        id: PropTypes.number.isRequired,
        name: PropTypes.string.isRequired,
        admin: PropTypes.shape().isRequired,
        channels: PropTypes.arrayOf(PropTypes.shape).isRequired,
        directMessageMembers: PropTypes.arrayOf(PropTypes.shape).isRequired,
    }).isRequired,
    isOwner: PropTypes.bool.isRequired,
    teamIndex: PropTypes.number.isRequired,
};

export default Sidebar;
