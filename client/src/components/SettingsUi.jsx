import React from 'react';
import PropTypes from 'prop-types';

import {
    List,
    Select,
    Switch,
    ListItem,
    MenuItem,
    ListItemIcon,
    ListItemText,
    ListSubheader,
    ListItemSecondaryAction,
} from '@material-ui/core';
import { Palette, Brightness2, Lens } from '@material-ui/icons';
import { withStyles } from '@material-ui/core/styles';

import colors from '../colors';

const styles = {
    icon: {
        marginRight: 0,
    },
    menuItem: {
        display: 'flex',
    },
};

const SettingsUi = ({
    classes, appColor, isNightMode, onNightModeChange,
    onAppColorChange,
}) => (
    <List>
        <ListSubheader>Ui</ListSubheader>
        <ListItem>
            <ListItemIcon>
                <Palette />
            </ListItemIcon>
            <ListItemText primary="App color" />
            <ListItemSecondaryAction>
                <Select
                    disableUnderline
                    variant="outlined"
                    value={appColor}
                    onChange={({ target }) => onAppColorChange(target.value)}
                    inputProps={{
                        name: 'appColor',
                        id: 'app-color',
                        className: classes.menuItem,
                    }}
                >
                    {
                        colors.map((color, i) => (
                            <MenuItem
                                key={`app-color-${color.name}`}
                                value={i}
                            >
                                <ListItemIcon className={classes.icon}>
                                    <Lens style={{ color: color.light.main }} />
                                </ListItemIcon>
                                <ListItemText
                                    inset
                                    primary={color.name}
                                />
                            </MenuItem>
                        ))
                    }
                </Select>
            </ListItemSecondaryAction>
        </ListItem>
        <ListItem>
            <ListItemIcon>
                <Brightness2 />
            </ListItemIcon>
            <ListItemText primary="Night mode" />
            <ListItemSecondaryAction>
                <Switch
                    onChange={onNightModeChange}
                    checked={isNightMode}
                />
            </ListItemSecondaryAction>
        </ListItem>
    </List>
);

SettingsUi.propTypes = {
    classes: PropTypes.objectOf(PropTypes.string).isRequired,
    appColor: PropTypes.number.isRequired,
    isNightMode: PropTypes.bool.isRequired,
    onNightModeChange: PropTypes.func.isRequired,
    onAppColorChange: PropTypes.func.isRequired,
};

export default withStyles(styles)(SettingsUi);
