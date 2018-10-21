import React from 'react';
import PropTypes from 'prop-types';

import NotificationContent from '../components/NotificationContent';

class Notification extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            open: false,
        };
    }

    onCloseHandler = (event, reason) => {
        if (reason === 'clickaway') return;
        this.setState({ open: false });
    };

    render() {
        const { open } = this.state;
        const { text } = this.props;
        return (
            <NotificationContent
                open={open}
                text={text}
                onClose={this.onCloseHandler}
            />
        );
    }
}

Notification.propTypes = {
    text: PropTypes.string.isRequired,
};

export default Notification;
