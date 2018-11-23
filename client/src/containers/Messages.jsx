import React from 'react';
import PropTypes from 'prop-types';
import { reverse } from 'lodash';
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

const MESSAGES_LIMIT = 20;
const AUDIO_URL = 'https://notificationsounds.com/soundfiles/99c5e07b4d5de9d18c350cdf64c5aa3d/file-sounds-1110-stairs.wav';

class Messages extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            hasMore: true,
        };
        this.bottom = React.createRef();
        this.scroller = React.createRef();
        this.audio = new Audio(audioFile);
    }

    componentWillMount() {
        const { channelId } = this.props;
        this.unsubscribe = this.subscribe(channelId);
    }

    componentWillReceiveProps({ channelId }) {
        const { channelId: oldChannelId } = this.props;
        if (channelId !== oldChannelId) {
            this.setState({ hasMore: true });
            if (this.unsubscribe) this.unsubscribe();
            this.unsubscribe = this.subscribe(channelId);
        }
    }

    componentDidUpdate() {
        const { data: { getMessages } } = this.props;
        if (getMessages && getMessages.length <= MESSAGES_LIMIT) {
            this.scrollDown();
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
                        channelMessagesUpdates,
                        ...prev.getMessages,
                    ],
                };
            },
        });
    }

    handleScroll = () => {
        if (this.scroller && this.scroller.scrollTop < 200) {
            const { hasMore } = this.state;
            const { channelId, data: { getMessages, fetchMore } } = this.props;
            if (hasMore && getMessages.length >= MESSAGES_LIMIT) {
                fetchMore({
                    variables: {
                        channelId,
                        cursor: getMessages[getMessages.length - 1].created_at,
                    },
                    updateQuery: (prev, { fetchMoreResult }) => {
                        if (!fetchMoreResult) return prev;
                        if (fetchMoreResult.getMessages.length < MESSAGES_LIMIT) {
                            this.setState({ hasMore: false });
                        }
                        return {
                            ...prev,
                            getMessages: [
                                ...prev.getMessages,
                                ...fetchMoreResult.getMessages,
                            ],
                        };
                    },
                });
            }
        }
    }

    scrollDown = () => {
        if (this.bottom) this.bottom.scrollIntoView();
    }

    render() {
        const { data: { loading, getMessages }, channelId, userId } = this.props;
        return (
            loading
                ? <Loading small />
                : (
                    <FileUpload
                        channelId={channelId}
                        disableClick
                    >
                        <MessagesList
                            userId={userId}
                            messages={reverse(getMessages)}
                            onScroll={this.handleScroll}
                            listRef={(list) => { this.scroller = list; }}
                            bottomRef={(bottom) => { this.bottom = bottom; }}
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
