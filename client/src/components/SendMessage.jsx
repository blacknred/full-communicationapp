import React from 'react';
import PropTypes from 'prop-types';

import {
    Input,
    Toolbar,
} from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';

const drawersWidth = 90 + 240;

const styles = theme => ({
    toolbar: {
        bottom: 0,
        left: 'auto',
        right: 0,
        position: 'absolute',
        width: `calc(100% - ${drawersWidth}px)`,
        marginLeft: drawersWidth,
        padding: theme.spacing.unit * 2,
        backgroundColor: theme.palette.background.default,
    },
    // theme.mixins.toolbar,
    content: {
        flexGrow: 1,
        padding: theme.spacing.unit * 1,
        borderRadius: '3px',
        border: `solid 1px ${theme.palette.grey[300]}`,
    },
});

const SendMessage = ({ classes, channelName }) => (
    <Toolbar className={classes.toolbar}>
        <form
            className={classes.content}
            noValidate
            autoComplete="off"
        >
            <Input
                id="new-message"
                label="new-message"
                margin="dense"
                fullWidth
                disableUnderline
                placeholder={`Message #${channelName}`}
            />
        </form>
    </Toolbar>
);

SendMessage.propTypes = {
    classes: PropTypes.objectOf(PropTypes.string).isRequired,
    channelName: PropTypes.string.isRequired,
};

export default withStyles(styles)(SendMessage);
