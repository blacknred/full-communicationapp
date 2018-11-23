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

import FileUpload from '../containers/FileUpload';

const ENTER_KEY = 13;

const styles = theme => ({
    toolbar: {
        backgroundColor: theme.palette.background.paper,
    },
    adornment: {
        height: '100%',
    },
});

const NewMessageForm = ({
    classes, width, placeholder, channelId, text, isFullOptionsOpen,
    onToggle, onChange, onSubmit, isFullFormOpen,
}) => {
    const fullOptionsToggle = () => isWidthDown('sm', width) && onToggle('isFullOptionsOpen');
    const basicOptions = (
        <React.Fragment>
            <IconButton
                onClick={() => {
                    fullOptionsToggle();
                    onToggle('isFullFormOpen');
                }}
            >
                <Notes />
            </IconButton>
            <FileUpload channelId={channelId}>
                <IconButton onClick={fullOptionsToggle}>
                    <AttachFile />
                </IconButton>
            </FileUpload>
        </React.Fragment>
    );
    const fullOptions = (
        <React.Fragment>
            {basicOptions}
            <IconButton onClick={fullOptionsToggle}>
                <InsertLink />
            </IconButton>
            <IconButton onClick={fullOptionsToggle}>
                <InsertChart />
            </IconButton>
        </React.Fragment>
    );
    return (
        <React.Fragment>
            <Divider light />
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
                                <InputAdornment
                                    position="end"
                                    className={classes.adornment}
                                >
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
    channelId: PropTypes.number.isRequired,
    placeholder: PropTypes.string.isRequired,
    text: PropTypes.string.isRequired,
    isFullFormOpen: PropTypes.bool.isRequired,
    isFullOptionsOpen: PropTypes.bool.isRequired,
    onToggle: PropTypes.func.isRequired,
    onChange: PropTypes.func.isRequired,
    onSubmit: PropTypes.func.isRequired,
};

export default compose(withStyles(styles), withWidth())(NewMessageForm);
