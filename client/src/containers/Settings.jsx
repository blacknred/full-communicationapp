import React from 'react';
import PropTypes from 'prop-types';
import { inject, observer } from 'mobx-react';
import { graphql, compose, Mutation } from 'react-apollo';

import Loading from '../components/Loading';
import SettingsUi from '../components/SettingsUi';
import SettingsTeams from '../components/SettingsTeams';
import SettingsModal from '../components/SettingsModal';
import SettingsProfile from '../components/SettingsProfile';
import OnDeleteWarningForm from '../components/DeleteWarningForm';

import {
    GET_CURRENT_USER_QUERY,
    UPDATE_USER_MUTATION,
    DELETE_USER_MUTATION,
} from '../graphql/user';
import {
    GET_TEAMS_QUERY,
    UPDATE_TEAM_MUTATION,
    DELETE_TEAM_MUTATION,
} from '../graphql/team';

class Settings extends React.Component {
    constructor(props) {
        super(props);
        this.state = {

            isTeamDeleteWarningFormOpen: false,
            isProfileDeleteWarningFormOpen: false,

            ctxTeamId: null,
            ctxTeamName: '',
        };
    }

    onToggleHandler = (target) => {
        this.setState(prevState => ({
            [target]: !prevState[target],
        }));
    }

    onUpdateHandler = (option, value) => {
        this.setState({ [option]: value });
        console.log('update: ', option, value);
    }

    render() {
        const {
            isTeamDeleteWarningFormOpen, isProfileDeleteWarningFormOpen,
            ctxTeamName,
        } = this.state;
        const {
            store: {
                isNightMode, isSoundsOn, appColor,
                toggleNightMode, toggleSoundsOn, changeAppColor,
            }, open, onClose, getCurrentUserQuery, getTeamsQuery,
        } = this.props;

        if (getCurrentUserQuery.loading || getTeamsQuery.loading) {
            return <Loading />;
        }
        if (getCurrentUserQuery.error || getTeamsQuery.error) {
            return (
                null
            );
        }

        return (
            <SettingsModal
                open={open}
                onClose={onClose}
            >
                <SettingsUi
                    appColor={appColor}
                    isNightMode={isNightMode}
                    isSoundsOn={isSoundsOn}
                    onNightModeChange={toggleNightMode}
                    onSoundsOnChange={toggleSoundsOn}
                    onAppColorChange={changeAppColor}
                />
                <Mutation
                    mutation={UPDATE_USER_MUTATION}
                    ignoreResults
                >
                    {updateUser => (
                        <SettingsProfile
                            user={getCurrentUserQuery.getCurrentUser}
                            onSubmit={() => this.onChannelDeleteHandler(updateUser)}
                        />
                    )}
                </Mutation>
                <Mutation
                    mutation={DELETE_USER_MUTATION}
                    ignoreResults
                >
                    {deleteUser => (
                        <OnDeleteWarningForm
                            open={isProfileDeleteWarningFormOpen}
                            message="You are trying to delete profile.
                            All your teams, channels and messages will be deleted also."
                            onSubmit={() => this.onTeamDeleteHandler(deleteUser)}
                            onClose={() => this.onToggleHandler('isProfileDeleteWarningFormOpen')}
                        />
                    )}
                </Mutation>
                <Mutation
                    mutation={UPDATE_TEAM_MUTATION}
                    ignoreResults
                >
                    {updateTeam => (
                        <SettingsTeams
                            teams={getTeamsQuery.getTeams}
                            onToggle={() => this.onToggleHandler('isTeamDeleteWarningFormOpen')}
                            onSubmit={() => this.onChannelDeleteHandler(updateTeam)}
                        />
                    )}
                </Mutation>
                <Mutation
                    mutation={DELETE_TEAM_MUTATION}
                    ignoreResults
                >
                    {deleteTeam => (
                        <OnDeleteWarningForm
                            open={isTeamDeleteWarningFormOpen}
                            message={`You are deleting ${ctxTeamName} team.
                            All related channels and messages will be deleted also.`}
                            onSubmit={() => this.onTeamDeleteHandler(deleteTeam)}
                            onClose={() => this.onToggleHandler('isTeamDeleteWarningFormOpen')}
                        />
                    )}
                </Mutation>
            </SettingsModal>
        );
    }
}

Settings.propTypes = {
    open: PropTypes.bool.isRequired,
    store: PropTypes.shape().isRequired,
    onClose: PropTypes.func.isRequired,
    getCurrentUserQuery: PropTypes.shape().isRequired,
    getTeamsQuery: PropTypes.shape().isRequired,
};

export default compose(
    graphql(GET_CURRENT_USER_QUERY, { name: 'getCurrentUserQuery' }),
    graphql(GET_TEAMS_QUERY, { name: 'getTeamsQuery' }),
)(inject('store')(observer(Settings)));
