import React from 'react';
import Select from 'react-select';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

import {
    Slide,
    Paper,
    Dialog,
    TextField,
    MenuItem,
    Typography,
    DialogTitle,
    DialogContent,
} from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';

const styles = theme => ({
    form: {
        marginTop: theme.spacing.unit * 2,
        minWidth: 300,
        width: '100%', // Fix IE11 issue.
    },
});

const NoOptionsMessage = ({ selectProps, innerProps, children }) => (
    <Typography
        color="textSecondary"
        className={selectProps.classes.noOptionsMessage}
        {...innerProps}
    >
        {children}
    </Typography>
);

const inputComponent = ({ inputRef, ...props }) => (
    <div ref={inputRef} {...props} />
);

const Control = ({
    selectProps, innerProps, innerRef, children,
}) => (
    <TextField
        autoFocus
        name="adresat"
        // label="Search users in team"
        // placeholder="..."
        fullWidth
        InputProps={{
            inputComponent,
            inputProps: {
                className: selectProps.classes.form,
                inputRef: innerRef,
                children,
                ...innerProps,
            },
        }}
        {...selectProps.textFieldProps}
    />
);

const Option = ({
    innerRef, isFocused, isSelected, innerProps, children,
}) => (
    <MenuItem
        buttonRef={innerRef}
        selected={isFocused}
        component={Link}
        to={`/teams/${innerProps.currentTeamId}/user/${innerProps.adresat}`}
        style={{ fontWeight: isSelected ? 500 : 400 }}
        {...innerProps}
    >
        {children}
    </MenuItem>
);

const Placeholder = ({ selectProps, innerProps, children }) => (
    <Typography
        color="textSecondary"
        className={selectProps.classes.placeholder}
        {...innerProps}
    >
        {children}
    </Typography>
);

const SingleValue = ({ selectProps, innerProps, children }) => (
    <Typography
        className={selectProps.classes.singleValue}
        {...innerProps}
    >
        {children}
    </Typography>
);

const ValueContainer = ({ selectProps, children }) => (
    <div className={selectProps.classes.valueContainer}>
        {children}
    </div>
);

const Menu = ({ selectProps, innerProps, children }) => (
    <Paper
        square
        className={selectProps.classes.paper}
        {...innerProps}
    >
        {children}
    </Paper>
);

const SearchTeamMembersForm = ({
    classes, open, onClose, members, adresat, onChange, currentTeamId,
}) => (
    <Dialog
        open={open}
        onClose={onClose}
        TransitionComponent={
            props => <Slide direction="up" {...props} />
        }
        keepMounted
    >
        <DialogTitle>Find the team member for chatting</DialogTitle>
        <DialogContent>
            <Select
                // styles={selectStyles}
                classes={classes}
                options={members}
                components={{
                    Control,
                    Menu,
                    // MultiValue,
                    NoOptionsMessage,
                    Option,
                    Placeholder,
                    SingleValue,
                    ValueContainer,
                }}
                value={adresat}
                onChange={onChange} // withRouter() history.push('')
                placeholder="Search a person"
            />
        </DialogContent>
    </Dialog>
);

SearchTeamMembersForm.propTypes = {
    classes: PropTypes.objectOf(PropTypes.string).isRequired,
    open: PropTypes.bool.isRequired,
    currentTeamId: PropTypes.number.isRequired,
    members: PropTypes.arrayOf(PropTypes.shape().isRequired).isRequired,
    adresat: PropTypes.string.isRequired,
    onClose: PropTypes.func.isRequired,
    onChange: PropTypes.func.isRequired,
};

export default withStyles(styles)(SearchTeamMembersForm);
