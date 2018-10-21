import React from 'react';
import PropTypes from 'prop-types';

import {
    List,
    Avatar,
    Button,
    Divider,
    ListItem,
    ListItemText,
    ListSubheader,
    ListItemAvatar,
    ListItemSecondaryAction,
} from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';

const styles = theme => ({
    root: {
        flex: 1,
        marginLeft: theme.spacing.unit * 2,
    },
});

const SettingsTeams = ({ classes, teams, onToggle }) => (
    <List>
        <Divider light />
        <ListSubheader>Own Teams</ListSubheader>
        {
            teams.map(team => (
                <ListItem key={team.id}>
                    <ListItemAvatar>
                        <Avatar>
                            {team.name.charAt(0).toUpperCase()}
                        </Avatar>
                    </ListItemAvatar>
                    <ListItemText
                        primary={team.name}
                        secondary={team.admin.username}
                    />
                    <ListItemSecondaryAction>
                        <Button
                            onClick={onToggle}
                            children="Update"
                        />
                        <Button
                            onClick={onToggle}
                            children="Delete"
                        />
                    </ListItemSecondaryAction>
                </ListItem>
            ))
        }
    </List>
);

SettingsTeams.propTypes = {
    classes: PropTypes.objectOf(PropTypes.string).isRequired,
    teams: PropTypes.arrayOf(PropTypes.shape()).isRequired,
    onToggle: PropTypes.func.isRequired,
};

export default withStyles(styles)(SettingsTeams);
