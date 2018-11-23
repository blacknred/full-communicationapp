import React from 'react';
import PropTypes from 'prop-types';
import { TransitionGroup } from 'react-transition-group';

import { withStyles } from '@material-ui/core/styles';

import Message from './Message';

const styles = theme => ({
    content: {
        overflowX: 'hidden',
        padding: `${theme.spacing.unit}px 0`,
        height: '100%',
    },
});

const MessagesList = ({
    classes, messages, userId, onScroll, listRef, bottomRef,
}) => (
    <div
        className={classes.content}
        onScroll={onScroll}
        ref={listRef}
    >
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
        <div ref={bottomRef} />
    </div>
);

MessagesList.propTypes = {
    userId: PropTypes.number.isRequired,
    classes: PropTypes.objectOf(PropTypes.string).isRequired,
    messages: PropTypes.arrayOf(PropTypes.shape()).isRequired,
    onScroll: PropTypes.func.isRequired,
    listRef: PropTypes.func.isRequired,
    bottomRef: PropTypes.func.isRequired,
};

export default withStyles(styles)(MessagesList);
