import React from 'react';
import PropTypes from 'prop-types';

import {
    Input,
    Toolbar,
    Divider,
    IconButton,
    InputAdornment,
} from '@material-ui/core';
import { Image } from '@material-ui/icons';
import { withStyles } from '@material-ui/core/styles';

const ENTER_KEY = 13;

const styles = theme => ({
    toolbar: {
        backgroundColor: theme.palette.background.paper,
    },
});

const NewMessageForm = ({
    classes, placeholder, message, onChange, onSubmit,
}) => (
    <React.Fragment>
        <Divider />
        <Toolbar className={classes.toolbar}>
            <Input
                autoFocus
                disableUnderline
                fullWidth
                id="new-message"
                type="text"
                name="text"
                autoComplete="off"
                multiline={message.length > 50}
                value={message}
                placeholder={`Message #${placeholder}`}
                onChange={onChange}
                onKeyDown={e => e.keyCode === ENTER_KEY && onSubmit()}
                endAdornment={(
                    <InputAdornment position="end">
                        <IconButton>
                            <Image />
                        </IconButton>
                    </InputAdornment>
                )}
            />
        </Toolbar>
    </React.Fragment>
);

NewMessageForm.propTypes = {
    classes: PropTypes.objectOf(PropTypes.string).isRequired,
    placeholder: PropTypes.string.isRequired,
    message: PropTypes.string.isRequired,
    onChange: PropTypes.func.isRequired,
    onSubmit: PropTypes.func.isRequired,
};

export default withStyles(styles)(NewMessageForm);
