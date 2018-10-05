import React from 'react';
import PropTypes from 'prop-types';
import { graphql } from 'react-apollo';

import Loading from '../components/Loading';
import MessagesList from '../components/MessagesList';

import {
    DIRECT_MESSAGES_QUERY,
    DIRECT_MESSAGES_SUBSCRIPTION,
} from '../graphql/message';

class DirectMessages extends React.Component {
    componentWillMount() {
        const { teamId, userId } = this.props;
        this.unsubscribe = this.subscribe(teamId, userId);
    }

    componentWillReceiveProps(nextProps) {
        const { teamId, userId } = this.props;
        if (userId !== nextProps.userId || teamId !== nextProps.teamId) {
            if (this.unsubscribe) this.unsubscribe();
            this.unsubscribe = this.subscribe(nextProps.teamId, nextProps.userId);
        }
    }

    componentWillUnmount() {
        if (this.unsubscribe) this.unsubscribe();
    }

    subscribe = (teamId, userId) => {
        const { data } = this.props;
        console.log(`subscribed to messages of team ${teamId} member ${userId} `);
        return data.subscribeToMore({
            document: DIRECT_MESSAGES_SUBSCRIPTION,
            variables: { teamId, userId },
            updateQuery: (prev, { subscriptionData }) => {
                if (!subscriptionData) return prev;
                return {
                    ...prev,
                    directMessages: [
                        ...prev.directMessages,
                        subscriptionData.data.newDirectMessage,
                    ],
                };
            },
        });
    }

    render() {
        const { data: { loading, directMessages } } = this.props;
        return (
            loading
                ? <Loading small />
                : <MessagesList messages={directMessages} />
        );
    }
}

DirectMessages.propTypes = {
    teamId: PropTypes.number.isRequired,
    userId: PropTypes.number.isRequired,
    data: PropTypes.shape({
        loading: PropTypes.bool.isRequired,
        directMessages: PropTypes.array,
    }).isRequired,
};

export default graphql(
    DIRECT_MESSAGES_QUERY,
    {
        options: props => ({
            variables: {
                teamId: props.teamId,
                userId: props.userId,
            },
            fetchPolicy: 'network-only',
        }),
    },
)(DirectMessages);
