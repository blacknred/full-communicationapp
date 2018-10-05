import React from 'react';
import PropTypes from 'prop-types';

import ContentHeader from '../components/ContentHeader';

const Header = ({ title, status }) => (
    <ContentHeader
        title={title}
        status={status}
    />
);

Header.propTypes = {
    title: PropTypes.string.isRequired,
    status: PropTypes.string.isRequired,
};

export default Header;
