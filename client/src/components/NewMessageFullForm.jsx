import React from 'react';
import PropTypes from 'prop-types';
import { compose } from 'recompose';

import {
    Slide,
    Input,
    Button,
    Dialog,
    Toolbar,
    IconButton,
    DialogContent,
    DialogActions,
} from '@material-ui/core';
import {
    InsertLink,
    AttachFile,
    InsertChart,
} from '@material-ui/icons';
import { withStyles } from '@material-ui/core/styles';
import withWidth, { isWidthDown } from '@material-ui/core/withWidth';

import FileUpload from '../containers/FileUpload';

const styles = theme => ({
    form: {
        marginTop: theme.spacing.unit * 2,
        width: '100%', // Fix IE11 issue.
        minWidth: 400,
    },
});

function Transition(props) {
    return <Slide direction="up" {...props} />;
}

const NewMessageFullForm = ({
    classes, width, isFullFormOpen, placeholder, channelId, text,
    onClose, onChange, onSubmit,
}) => (
    <Dialog
        open={isFullFormOpen}
        fullScreen={isWidthDown('sm', width)}
        onClose={() => onClose('isFullFormOpen')}
        TransitionComponent={Transition}
    >
        <DialogContent>
            <Input
                autoFocus
                disableUnderline
                fullWidth
                id="new-message-full"
                type="text"
                name="text"
                autoComplete="off"
                multiline
                value={text}
                placeholder={`Message #${placeholder}`}
                onChange={onChange}
                rows={6}
                className={classes.form}
            />
        </DialogContent>
        <Toolbar>
            <FileUpload channelId={channelId}>
                <IconButton>
                    <AttachFile />
                </IconButton>
            </FileUpload>
            <IconButton>
                <InsertLink />
            </IconButton>
            <IconButton>
                <InsertChart />
            </IconButton>
        </Toolbar>
        <DialogActions>
            <Button
                onClick={() => onClose('isFullFormOpen')}
                children="Cansel"
            />
            <Button
                type="submit"
                variant="contained"
                color="primary"
                onClick={onSubmit}
                children="Send"
                disabled={text.length === 0}
            />
        </DialogActions>
    </Dialog>
);

NewMessageFullForm.propTypes = {
    classes: PropTypes.objectOf(PropTypes.string).isRequired,
    width: PropTypes.string.isRequired,
    channelId: PropTypes.number.isRequired,
    placeholder: PropTypes.string.isRequired,
    text: PropTypes.string.isRequired,
    isFullFormOpen: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    onChange: PropTypes.func.isRequired,
    onSubmit: PropTypes.func.isRequired,
};

export default compose(withStyles(styles), withWidth())(NewMessageFullForm);
