import React from 'react';
import Select from 'react-select';
import PropTypes from 'prop-types';
import { compose } from 'recompose';
import { Link, withRouter } from 'react-router-dom';

import {
    Slide,
    Paper,
    Dialog,
    MenuItem,
    TextField,
    IconButton,
    Typography,
    DialogActions,
    DialogContent,
} from '@material-ui/core';
import { Close } from '@material-ui/icons';
import { withStyles } from '@material-ui/core/styles';
import withWidth, { isWidthDown } from '@material-ui/core/withWidth';

const styles = theme => ({
    form: {
        marginTop: theme.spacing.unit * 2,
        minWidth: 300,
        width: '100%', // Fix IE11 issue.
    },
    root: {
        flexGrow: 1,
        height: 250,
    },
    input: {
        display: 'flex',
        padding: 0,
    },
    valueContainer: {
        display: 'flex',
        flexWrap: 'wrap',
        flex: 1,
        alignItems: 'center',
    },
    chip: {
        margin: `${theme.spacing.unit / 2}px ${theme.spacing.unit / 4}px`,
    },
    chipFocused: {
        // backgroundColor: emphasize(
        //     theme.palette.type === 'light' ? theme.palette.grey[300] : theme.palette.grey[700],
        //     0.08,
        // ),
    },
    noOptionsMessage: {
        padding: `${theme.spacing.unit}px ${theme.spacing.unit * 2}px`,
    },
    singleValue: {
        fontSize: 16,
    },
    placeholder: {
        position: 'absolute',
        left: 2,
        fontSize: 16,
    },
    paper: {
        position: 'absolute',
        zIndex: 1,
        marginTop: theme.spacing.unit,
        left: 0,
        right: 0,
    },
    divider: {
        height: theme.spacing.unit * 2,
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
    innerRef, isFocused, isSelected, innerProps, history, children,
}) => (
        <MenuItem
            onClick={() => history.push('')} // withRouter() 
            buttonRef={innerRef}
            selected={isFocused}
            // component={Link}
            // to={`/teams/${innerProps.currentTeamId}/user/${innerProps.adresat}`}
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
    classes, width, open, onClose, members, adresat, onChange, currentTeamId,
}) => (
        <Dialog
            open={open}
            fullScreen={isWidthDown('sm', width)}
            onClose={() => onClose('isSearchTeamMembersModalOpen')}
            TransitionComponent={
                props => <Slide direction="up" {...props} />
            }
            keepMounted
        >
            <DialogActions>
                <Typography variant="title">Find the team member for chatting</Typography>
                <IconButton onClick={() => onClose('isSearchTeamMembersModalOpen')}>
                    <Close />
                </IconButton>
            </DialogActions>
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
    width: PropTypes.string.isRequired,
    open: PropTypes.bool.isRequired,
    currentTeamId: PropTypes.number.isRequired,
    members: PropTypes.arrayOf(PropTypes.shape().isRequired).isRequired,
    adresat: PropTypes.string.isRequired,
    onClose: PropTypes.func.isRequired,
    onChange: PropTypes.func.isRequired,
};

export default compose(withStyles(styles), withWidth())(withRouter(SearchTeamMembersForm));
