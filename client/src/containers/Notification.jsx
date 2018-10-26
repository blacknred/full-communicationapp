import React from 'react';
import PropTypes from 'prop-types';
import { observer, inject } from 'mobx-react';

import NotificationContent from '../components/Notification';

class Notification extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            open: true,
            text: ',ljkhljhkl',
        };
    }

    componentWillReceiveProps(nextProps) {
        const { text } = nextProps;
        this.setState({ text });
    }

    onCloseHandler = (event, reason) => {
        if (reason === 'clickaway') return;
        this.setState({ open: false });
    };

    render() {
        const { store } = this.props;
        return (
            <NotificationContent
                {...this.state}
                onClose={this.onCloseHandler}
            />
        );
    }
}

Notification.propTypes = {
    text: PropTypes.string,
};

export default inject('store')(observer(Notification));
