import React from 'react';
import PropTypes from 'prop-types';
import { compose } from 'recompose';

import {
    Input,
    Hidden,
    Toolbar,
    Divider,
    IconButton,
    InputAdornment,
} from '@material-ui/core';
import {
    Notes,
    MoreHoriz,
    InsertLink,
    AttachFile,
    InsertChart,
} from '@material-ui/icons';
import { withStyles } from '@material-ui/core/styles';
import withWidth, { isWidthDown } from '@material-ui/core/withWidth';

const ENTER_KEY = 13;

const styles = theme => ({
    toolbar: {
        backgroundColor: theme.palette.background.paper,
    },
});

const NewMessageForm = ({
    classes, width, placeholder, text, isFullOptionsOpen,
    onToggle, onChange, onSubmit, isFullFormOpen,
}) => {
    const basicOptions = (
        <React.Fragment>
            <IconButton
                onClick={() => {
                    if (isWidthDown('sm', width)) onToggle('isFullOptionsOpen');
                    onToggle('isFullFormOpen');
                }}
            >
                <Notes />
            </IconButton>
            <IconButton
                onClick={() => {
                    if (isWidthDown('sm', width)) onToggle('isFullOptionsOpen');
                    onToggle('isFileUploadFormOpen');
                }}
            >
                <AttachFile />
            </IconButton>
        </React.Fragment>
    );
    const fullOptions = (
        <React.Fragment>
            {basicOptions}
            <IconButton
                onClick={() => (
                    isWidthDown('sm', width) && onToggle('isFullOptionsOpen')
                )}
            >
                <InsertLink />
            </IconButton>
            <IconButton
                onClick={() => (
                    isWidthDown('sm', width) && onToggle('isFullOptionsOpen')
                )}
            >
                <InsertChart />
            </IconButton>
        </React.Fragment>
    );
    return (
        <React.Fragment>
            <Divider />
            <Toolbar className={classes.toolbar}>
                {
                    !isFullFormOpen && (
                        <Input
                            autoFocus
                            disableUnderline
                            fullWidth
                            id="new-message"
                            type="text"
                            name="text"
                            autoComplete="off"
                            value={text}
                            placeholder={`Message #${placeholder}`}
                            onChange={onChange}
                            disabled={(isWidthDown('sm', width) && isFullOptionsOpen)}
                            onKeyDown={e => e.keyCode === ENTER_KEY && onSubmit()}
                            endAdornment={(
                                <InputAdornment position="end">
                                    {
                                        isFullOptionsOpen
                                            ? fullOptions
                                            : (
                                                <Hidden smDown>
                                                    {basicOptions}
                                                </Hidden>
                                            )
                                    }
                                    <IconButton
                                        onClick={() => onToggle('isFullOptionsOpen')}
                                    >
                                        <MoreHoriz />
                                    </IconButton>
                                </InputAdornment>
                            )}
                        />
                    )
                }

            </Toolbar>
        </React.Fragment>
    );
};

NewMessageForm.propTypes = {
    classes: PropTypes.objectOf(PropTypes.string).isRequired,
    width: PropTypes.string.isRequired,
    placeholder: PropTypes.string.isRequired,
    text: PropTypes.string.isRequired,
    isFullFormOpen: PropTypes.bool.isRequired,
    isFullOptionsOpen: PropTypes.bool.isRequired,
    onToggle: PropTypes.func.isRequired,
    onChange: PropTypes.func.isRequired,
    onSubmit: PropTypes.func.isRequired,
};

export default compose(withStyles(styles), withWidth())(NewMessageForm);
