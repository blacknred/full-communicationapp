import React from 'react';
import PropTypes from 'prop-types';

import ContentHeader from '../components/ContentHeader';

const Header = ({ title }) => (
    <ContentHeader
        title={title}
    />
);

Header.propTypes = {
    title: PropTypes.string.isRequired,
};

export default Header;
