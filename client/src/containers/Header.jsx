import React from 'react';
import PropTypes from 'prop-types';

import HeaderContent from '../components/HeaderContent';

const Header = ({ channelName }) => (
    <HeaderContent
        channelName={channelName}
    />
);

Header.propTypes = {
    channelName: PropTypes.string.isRequired,
};

export default Header;
