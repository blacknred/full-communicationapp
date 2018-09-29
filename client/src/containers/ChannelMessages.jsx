import React from 'react';
import PropTypes from 'prop-types';
import { graphql } from 'react-apollo';

import Loading from '../components/Loading';
import MessagesList from '../components/MessagesList';

import {
    CHANNEL_MESSAGES_QUERY,
    CHANNEL_MESSAGES_SUBSCRIPTION,
} from '../graphql/message';

class ChannelMessages extends React.Component {
    componentWillMount() {
        const { channelId } = this.props;
        this.unsubscribe = this.subscribe(channelId);
    }

    componentWillReceiveProps(nextProps) {
        const { channelId } = this.props;
        if (channelId !== nextProps.channelId) {
            if (this.unsubscribe) this.unsubscribe();
            this.unsubscribe = this.subscribe(nextProps.channelId);
        }
    }

    componentWillUnmount() {
        if (this.unsubscribe) this.unsubscribe();
    }

    subscribe = (channelId) => {
        const { data } = this.props;
        console.log(`subscribed to channel ${channelId} messages`);
        data.subscribeToMore({
            document: CHANNEL_MESSAGES_SUBSCRIPTION,
            variables: { channelId },
            updateQuery: (prev, { subscriptionData }) => {
                if (!subscriptionData) return prev;
                return {
                    ...prev,
                    messages: [
                        ...prev.messages,
                        subscriptionData.data.newChannelMessage,
                    ],
                };
            },
        });
    }

    render() {
        const { data: { loading, messages } } = this.props;
        return (
            loading
                ? <Loading small />
                : <MessagesList messages={messages} />
        );
    }
}

ChannelMessages.propTypes = {
    channelId: PropTypes.number.isRequired,
    data: PropTypes.shape({
        loading: PropTypes.bool.isRequired,
        messages: PropTypes.array,
    }).isRequired,
};

export default graphql(
    CHANNEL_MESSAGES_QUERY,
    {
        variables: props => ({
            channelId: props.channelId,
        }),
        options: {
            fetchPolicy: 'network-only',
        },
    },
)(ChannelMessages);
