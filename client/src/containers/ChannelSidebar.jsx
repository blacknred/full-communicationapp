import React from 'react';
import PropTypes from 'prop-types';
import { observer, inject } from 'mobx-react';

import ChannelSidebarContent from '../components/ChannelSidebar';

class ChannelSidebar extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    render() {
        const {
            store: { isChannelSidebarOpen, toggleChannelSidebar },
        } = this.props;
        return (
            <ChannelSidebarContent
                open={isChannelSidebarOpen}
                onToggle={toggleChannelSidebar}
            />
        );
    }
}

ChannelSidebar.propTypes = {
    store: PropTypes.shape().isRequired,
};

export default inject('store')(observer(ChannelSidebar));
