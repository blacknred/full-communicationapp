import React from 'react';
import PropTypes from 'prop-types';
import { TransitionGroup } from 'react-transition-group';

import { List } from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';

import Message from './Message';

const styles = {
    content: {
        flex: 1,
        overflowX: 'hidden',
    },
};

const MessagesList = ({
    classes, messages, userId,
}) => {
    const listBottom = React.createRef();
    // setTimeout(() => listBottom.current.scrollIntoView(), 250);
    return (
        <List className={classes.content}>
            <TransitionGroup component={null}>
                {
                    messages.map(message => (
                        <Message
                            {...message}
                            key={`msq-${message.id}`}
                            isOwner={message.sender.id === userId}
                        />
                    ))
                }
            </TransitionGroup>
            <div ref={listBottom} />
        </List>
    );
};

MessagesList.propTypes = {
    userId: PropTypes.number.isRequired,
    classes: PropTypes.objectOf(PropTypes.string).isRequired,
    messages: PropTypes.arrayOf(PropTypes.shape()).isRequired,
};

export default withStyles(styles)(MessagesList);
