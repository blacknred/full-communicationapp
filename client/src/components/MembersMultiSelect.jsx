import React from 'react';
import Select from 'react-select';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';

import {
    Paper,
    MenuItem,
    TextField,
    Typography,
} from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';

const styles = theme => ({
    form: {
        marginTop: theme.spacing.unit * 2,
        minWidth: 300,
        width: '100%', // Fix IE11 issue.
    },
    // root: {
    //     flexGrow: 1,
    //     height: 250,
    // },
    input: {
        display: 'flex',
        padding: 0,
    },
    // valueContainer: {
    //     display: 'flex',
    //     flexWrap: 'wrap',
    //     flex: 1,
    //     alignItems: 'center',
    // },
    noOptionsMessage: {
        padding: `${theme.spacing.unit}px ${theme.spacing.unit * 2}px`,
    },
    // singleValue: {
    //     fontSize: 16,
    // },
    // placeholder: {
    //     position: 'absolute',
    //     left: 2,
    //     fontSize: 16,
    // },
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

// react select components

const inputComponent = ({ inputRef, ...props }) => (
    <div ref={inputRef} {...props} />
);

const Control = ({
    selectProps, innerProps, innerRef, children,
}) => (
    <TextField
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

const NoOptionsMessage = ({ selectProps, innerProps, children }) => (
    <Typography
        color="textSecondary"
        className={selectProps.classes.noOptionsMessage}
        {...innerProps}
    >
        {children}
    </Typography>
);


// react select components


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


const MembersMultiSelectForm = ({
    classes, members, history, currentTeamId = 1,
}) => {
    const selectStyles = {
        input: base => ({
            ...base,
            color: '#fff',
            '& input': {
                font: 'inherit',
            },
        }),
    };
    return (
        <Select
            // className="basic-single"
            // classNamePrefix="select"
            autoFocus
            menuIsOpen
            options={members}
            onChange={opt => history.push(`/teams/${currentTeamId}/user/${opt.value}`)}
            placeholder="Type the username"
            styles={selectStyles}
            classes={classes}
            components={{
                Control,
                Menu,
                NoOptionsMessage,
                Option,
                // Placeholder,
                // SingleValue,
                // ValueContainer,
            }}
        />
    );
};

MembersMultiSelectForm.propTypes = {
    classes: PropTypes.objectOf(PropTypes.string).isRequired,
    members: PropTypes.arrayOf(PropTypes.shape().isRequired).isRequired,
};

export default withStyles(styles)(withRouter(MembersMultiSelectForm));
