import React from 'react';
import PropTypes from 'prop-types';

import {
    Toolbar,
    TextField,
} from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';

const DRAWER_WIDTH = 90 + 240;
const ENTER_KEY = 13;

const styles = theme => ({
    toolbar: {
        bottom: 0,
        left: 'auto',
        right: 0,
        position: 'absolute',
        width: `calc(100% - ${DRAWER_WIDTH}px)`,
        marginLeft: DRAWER_WIDTH,
        padding: theme.spacing.unit * 2,
        backgroundColor: theme.palette.background.default,
    },
    // theme.mixins.toolbar,
    form: {
        // flexGrow: 1,
        // padding: theme.spacing.unit * 1,
        // borderRadius: '3px',
        // border: `solid 1px ${theme.palette.grey[300]}`,
    },
});

const NewMessageForm = ({
    classes, placeholder, message, onChange, onSubmit,
}) => (
    <Toolbar className={classes.toolbar}>
        <TextField
            autoFocus
            fullWidth
            margin="dense"
            variant="outlined"
            id="new-message"
            name="text"
            className={classes.form}
            autoComplete="off"
            value={message}
            placeholder={`Message #${placeholder}`}
            onChange={onChange}
            onKeyDown={(e) => {
                if (e.keyCode === ENTER_KEY) onSubmit();
            }}
        />
    </Toolbar>
);

NewMessageForm.propTypes = {
    classes: PropTypes.objectOf(PropTypes.string).isRequired,
    placeholder: PropTypes.string.isRequired,
    message: PropTypes.string.isRequired,
    onChange: PropTypes.func.isRequired,
    onSubmit: PropTypes.func.isRequired,
};

export default withStyles(styles)(NewMessageForm);
