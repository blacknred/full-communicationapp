import React from 'react';
import PropTypes from 'prop-types';
import { graphql } from 'react-apollo';
import { observer, inject } from 'mobx-react';

import FileUpload from './FileUpload';
import Loading from '../components/Loading';
import MessagesList from '../components/MessagesList';

import audioFile from '../assets/file-sounds-1110-stairs.wav';

import {
    GET_MESSAGES_QUERY,
    CHANNEL_MESSAGES_SUBSCRIPTION,
} from '../graphql/message';

const AUDIO_URL = 'https://notificationsounds.com/soundfiles/99c5e07b4d5de9d18c350cdf64c5aa3d/file-sounds-1110-stairs.wav';

class Messages extends React.Component {
    componentWillMount() {
        const { channelId } = this.props;
        this.unsubscribe = this.subscribe(channelId);
        this.audio = new Audio(audioFile);
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
        const { data, store: { isSoundsOn }, userId } = this.props;
        console.log(`subscribed to messages of channel ${channelId}`);
        return data.subscribeToMore({
            document: CHANNEL_MESSAGES_SUBSCRIPTION,
            variables: { channelId },
            updateQuery: (prev, { subscriptionData }) => {
                if (!subscriptionData) return prev;
                const { data: { channelMessagesUpdates } } = subscriptionData;
                if (isSoundsOn && channelMessagesUpdates.sender.id !== userId) {
                    this.audio.play();
                }
                return {
                    ...prev,
                    getMessages: [
                        ...prev.getMessages,
                        channelMessagesUpdates,
                    ],
                };
            },
        });
    }

    render() {
        const { data: { loading, getMessages }, channelId, userId } = this.props;
        return (
            loading
                ? <Loading small />
                : (
                    <FileUpload
                        style={{
                            flex: 1,
                            minHeight: 0,
                            display: 'flex',
                        }}
                        channelId={channelId}
                        disableClick
                    >
                        <MessagesList
                            userId={userId}
                            messages={getMessages}
                        />
                    </FileUpload>
                )
        );
    }
}

Messages.propTypes = {
    channelId: PropTypes.number.isRequired,
    userId: PropTypes.number.isRequired,
    data: PropTypes.shape({
        loading: PropTypes.bool.isRequired,
        getMessages: PropTypes.array,
    }).isRequired,
    store: PropTypes.shape().isRequired,
};

export default graphql(
    GET_MESSAGES_QUERY,
    {
        options: ({ channelId }) => ({
            variables: { channelId },
            fetchPolicy: 'network-only',
        }),
    },
)(inject('store')(observer(Messages)));
