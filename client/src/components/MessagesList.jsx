import React from 'react';
import PropTypes from 'prop-types';
import { TransitionGroup } from 'react-transition-group';

import { List } from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';
import { WrapText } from '@material-ui/icons';

import Message from './Message';

const styles = theme => ({
    emptyIcon: {
        margin: '0 auto',
        height: '100%',
        fontSize: '4em',
    },
    content: {
        overflowX: 'hidden',
        height: '100%',
        display: 'flex',
        flex: 1,
        flexDirection: 'column-reverse',
        '&>div': {
            padding: `${theme.spacing.unit * 2}px ${theme.spacing.unit / 2}px`,
        },
    },
});

const MessagesList = ({ classes, messages }) => (
    <List className={classes.content}>
        {
            messages.length > 0
                ? (
                    <TransitionGroup>
                        {
                            messages.map(message => (
                                <Message
                                    key={`msq-${message.id}`}
                                    {...message}
                                />
                            ))
                        }
                    </TransitionGroup>
                ) : <WrapText color="disabled" className={classes.emptyIcon} />
        }
    </List>
);

MessagesList.propTypes = {
    classes: PropTypes.objectOf(PropTypes.string).isRequired,
    messages: PropTypes.arrayOf(PropTypes.shape()).isRequired,
};

export default withStyles(styles)(MessagesList);
