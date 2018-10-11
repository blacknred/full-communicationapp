import React from 'react';
import PropTypes from 'prop-types';
import { graphql } from 'react-apollo';

import FileUpload from './FileUpload';
import Loading from '../components/Loading';
import MessagesList from '../components/MessagesList';

import {
    GET_MESSAGES_QUERY,
    CHANNEL_MESSAGES_SUBSCRIPTION,
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
        console.log(`subscribed to messages of channel ${channelId}`);
        return data.subscribeToMore({
            document: CHANNEL_MESSAGES_SUBSCRIPTION,
            variables: { channelId },
            updateQuery: (prev, { subscriptionData }) => {
                if (!subscriptionData) return prev;
                return {
                    ...prev,
                    messages: [
                        ...prev.messages,
                        subscriptionData.data.channelMessagesUpdated,
                    ],
                };
            },
        });
    }

    render() {
        const { data: { loading, getMessages }, channelId } = this.props;
        return (
            loading
                ? <Loading small />
                : (
                    <FileUpload
                        style={{
                            gridColumn: 3,
                            gridRow: 2,
                            paddingLeft: '20px',
                            paddingRight: '20px',
                            display: 'flex',
                            flexDirection: 'column-reverse',
                            overflowY: 'auto',
                        }}
                        channelId={channelId}
                        disableClick
                    >
                        <MessagesList messages={getMessages} />
                    </FileUpload>
                )
        );
    }
}

Messages.propTypes = {
    channelId: PropTypes.number.isRequired,
    data: PropTypes.shape({
        loading: PropTypes.bool.isRequired,
        getMessages: PropTypes.array,
    }).isRequired,
};

export default graphql(
    GET_MESSAGES_QUERY,
    {
        options: props => ({
            variables: {
                channelId: props.channelId,
            },
            fetchPolicy: 'network-only',
        }),
    },
)(Messages);
