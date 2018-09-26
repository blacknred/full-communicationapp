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
    // componentWillMount() {
    //     const { channelId } = this.props;
    //     this.unsubscribe = this.subscribe(channelId);
    // }

    // componentWillReceiveProps(nextProps) {
    //     const { channelId } = this.props;
    //     if (channelId !== nextProps.channelId) {
    //         if (this.unsubscribe) this.unsubscribe();
    //         this.unsubscribe = this.subscribe(nextProps.channelId);
    //     }
    // }

    // componentWillUnmount() {
    //     if (this.unsubscribe) this.unsubscribe();
    // }

    // subscribe = (channelId) => {
    //     const { data } = this.props;
    //     console.log(`subscribed to channel ${channelId} messages`);
    //     data.subscribeToMore({
    //         document: DIRECT_MESSAGES_SUBSCRIPTION,
    //         variables: { channelId },
    //         updateQuery: (prev, { subscriptionData }) => {
    //             if (!subscriptionData) return prev;
    //             return {
    //                 ...prev,
    //                 messages: [
    //                     ...prev.messages,
    //                     subscriptionData.data.newChannelMessage,
    //                 ],
    //             };
    //         },
    //     });
    // }

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
        variables: props => ({
            teamId: props.teamId,
            userId: props.userId,
        }),
        options: {
            fetchPolicy: 'network-only',
        },
    },
)(DirectMessages);
