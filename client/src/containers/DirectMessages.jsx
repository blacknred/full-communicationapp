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
        const { userId } = this.props;
        this.unsubscribe = this.subscribe(userId);
    }

    componentWillReceiveProps(nextProps) {
        const { userId } = this.props;
        if (userId !== nextProps.userId) {
            if (this.unsubscribe) this.unsubscribe();
            this.unsubscribe = this.subscribe(nextProps.userId);
        }
    }

    componentWillUnmount() {
        if (this.unsubscribe) this.unsubscribe();
    }

    subscribe = (userId) => {
        const { data } = this.props;
        console.log(`subscribed to member ${userId} messages`);
        // data.subscribeToMore({
        //     document: DIRECT_MESSAGES_SUBSCRIPTION,
        //     variables: { userId },
        //     updateQuery: (prev, { subscriptionData }) => {
        //         if (!subscriptionData) return prev;
        //         return {
        //             ...prev,
        //             messages: [
        //                 ...prev.messages,
        //                 subscriptionData.data.newChannelMessage,
        //             ],
        //         };
        //     },
        // });
    }

    render() {
        const { data: { loading, directMessages } } = this.props;
        return (
            loading
                ? <Loading />
                : <MessagesList messages={directMessages} />
        );
    }
}

DirectMessages.propTypes = {
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
