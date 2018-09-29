import React from 'react';
import PropTypes from 'prop-types';

import HeaderContent from '../components/HeaderContent';

const Header = ({ title }) => (
    <HeaderContent
        title={title}
    />
);

Header.propTypes = {
    title: PropTypes.string.isRequired,
};

export default Header;
