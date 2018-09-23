import React from 'react';
import PropTypes from 'prop-types';
import { graphql } from 'react-apollo';

import MessagesList from '../components/MessagesList';

import {
    MESSAGES_QUERY,
    NEW_CHANNEL_MESSAGE_SUBSCRIPTION,
} from '../graphql/message';

class Messages extends React.Component {
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
        data.subscribeToMore({
            document: NEW_CHANNEL_MESSAGE_SUBSCRIPTION,
            variables: { channelId },
            updateQuery: (prev, { subscriptionData }) => {
                if (!subscriptionData) return prev;
                return {
                    ...prev,
                    message: [
                        ...prev.messages,
                        subscriptionData.newChannelMessage,
                    ],
                };
            },
        });
    }

    render() {
        const { data: { loading, messages }, channelId } = this.props;
        return (
            loading ? null
                : (
                    <MessagesList
                        channelId={channelId}
                        messages={messages}
                    />
                )
        );
    }
}

Messages.propTypes = {
    channelId: PropTypes.number.isRequired,
    data: PropTypes.shape({
        loading: PropTypes.bool.isRequired,
        messages: PropTypes.array,
    }).isRequired,
};

export default graphql(
    MESSAGES_QUERY,
    {
        variables: props => ({
            channelId: props.channelId,
        }),
        options: {
            fetchPolicy: 'network-only',
        },
    },
)(Messages);
