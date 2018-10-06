import React from 'react';
import PropTypes from 'prop-types';
import { findIndex } from 'lodash';
import { graphql } from 'react-apollo';

import NewMessage from './NewMessage';
import ContentHeader from './ContentHeader';
import ChannelMessages from './ChannelMessages';

import { CREATE_CHANNEL_MESSAGE_MUTATION } from '../graphql/message';

const ChannelContent = ({ channels, channelId, mutate }) => {
    const channelIdInt = parseInt(channelId, 10);
    const channelIdX = channelIdInt ? findIndex(channels, ['id', channelIdInt]) : 0;
    const channel = channelIdX === -1 ? channels[0] : channels[channelIdX];
    return (
        channel && (
            <React.Fragment>
                <ContentHeader
                    title={channel.name}
                    status={channel.public ? 'Public' : 'Private'}
                />
                <ChannelMessages channelId={channel.id} />
                <NewMessage
                    placeholder={channel.name}
                    submit={async (text) => {
                        await mutate({
                            variables: {
                                channelId: channel.id,
                                text,
                            },
                        });
                    }}
                />
            </React.Fragment>
        )
    );
};

ChannelContent.propTypes = {
    channels: PropTypes.arrayOf(PropTypes.shape).isRequired,
    channelId: PropTypes.string,
    mutate: PropTypes.func.isRequired,
};

export default graphql(CREATE_CHANNEL_MESSAGE_MUTATION)(ChannelContent);
