import React from 'react';
import PropTypes from 'prop-types';

import ChannelHeaderContent from '../components/ChannelHeader';

const ChannelHeader = ({ title, status }) => (
    <ChannelHeaderContent
        title={title}
        status={status}
    />
);

ChannelHeader.propTypes = {
    title: PropTypes.string.isRequired,
    status: PropTypes.string.isRequired,
};

export default ChannelHeader;
