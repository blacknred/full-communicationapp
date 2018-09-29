import React from 'react';
import PropTypes from 'prop-types';

import {
    Toolbar,
    TextField,
} from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';

const ENTER_KEY = 13;

const styles = theme => ({
    toolbar: {
        padding: theme.spacing.unit * 2,
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
            autoComplete="off"
            multiline={message.length > 50}
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
