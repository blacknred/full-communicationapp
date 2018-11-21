import React from 'react';
import Select from 'react-select';
import PropTypes from 'prop-types';

import {
    Chip,
    Paper,
    MenuItem,
    TextField,
    Typography,
    ListItemIcon,
    ListItemText,
} from '@material-ui/core';
import { Cancel, FiberManualRecord } from '@material-ui/icons';
import { withStyles } from '@material-ui/core/styles';

const styles = theme => ({
    form: {
        padding: theme.spacing.unit,
        display: 'flex',
        cursor: 'pointer',
    },
    noOptionsMessage: {
        padding: theme.spacing.unit * 2,
    },
    chip: {
        margin: theme.spacing.unit / 2,
    },
    paper: {
        marginTop: theme.spacing.unit,
    },
});

const inputComponent = ({ inputRef, ...props }) => (
    <div ref={inputRef} {...props} />
);
const Control = ({
    selectProps, innerProps, innerRef, children,
}) => (
    <TextField
        fullWidth
        variant="outlined"
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
const Menu = ({ selectProps, innerProps, children }) => (
    <Paper
        square
        className={selectProps.classes.paper}
        {...innerProps}
    >
        {children}
    </Paper>
);
const Placeholder = ({ innerProps }) => (
    <Typography
        color="textSecondary"
        variant="subtitle1"
        {...innerProps}
        children="Type the username..."
    />
);
const NoOptionsMessage = ({ selectProps, innerProps }) => (
    <Typography
        color="textSecondary"
        className={selectProps.classes.noOptionsMessage}
        {...innerProps}
        children="No members"
    />
);
const MultiValue = ({ selectProps, removeProps, children }) => (
    <Chip
        tabIndex={-1}
        label={children}
        className={selectProps.classes.chip}
        onDelete={removeProps.onClick}
        deleteIcon={<Cancel {...removeProps} />}
    />
);
const Option = ({ isFocused, innerProps, data }) => (
    <MenuItem
        selected={isFocused}
        {...innerProps}
    >
        <ListItemIcon>
            <FiberManualRecord
                fontSize="small"
                color={data.online ? 'secondary' : 'disabled'}
            />
        </ListItemIcon>
        <ListItemText inset primary={data.label} />
    </MenuItem>
);

const MembersSelectForm = ({
    classes, options = [], members, onChange,
}) => (
    <Select
        isMulti
        autoFocus
        classes={classes}
        components={{
            Placeholder,
            NoOptionsMessage,
            MultiValue,
            Option,
            Menu,
            Control,
        }}
        closeMenuOnSelect={false}
        onChange={arr => onChange({
            target: {
                name: 'members',
                value: arr.map(m => m.value),
            },
        })}
        options={
            options.map(m => ({
                value: m.id,
                label: m.username,
                online: m.online,
            }))
        }
        defaultValue={
            members.map(m => ({
                value: m.id,
                label: m.username,
                online: m.online,
            }))
        }
    />
);

MembersSelectForm.propTypes = {
    classes: PropTypes.objectOf(PropTypes.string).isRequired,
    onChange: PropTypes.func.isRequired,
    options: PropTypes.arrayOf(PropTypes.shape()).isRequired,
    members: PropTypes.arrayOf(PropTypes.shape().isRequired),
};

export default withStyles(styles)(MembersSelectForm);
