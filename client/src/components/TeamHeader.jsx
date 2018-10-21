import React from 'react';
import PropTypes from 'prop-types';

import {
    List,
    ListItem,
    IconButton,
    Toolbar,
    ListItemIcon,
    ListItemText,
    ListItemSecondaryAction,
} from '@material-ui/core';
import {
    Settings,
    RadioButtonChecked,
    RadioButtonUnchecked,
} from '@material-ui/icons';
import { withStyles } from '@material-ui/core/styles';

const styles = theme => ({
    admin: {
        // paddingTop: theme.spacing.unit / 2,
        '& svg': {
            color: theme.palette.secondary.main,
            width: '0.7em',
            margin: 0,
        },
    },
});

const TeamHeader = ({
    classes, teamName, admin: { username, online },
}) => (
    <List>
        <ListItem>
            <ListItemText
                primary={teamName.charAt(0).toUpperCase() + teamName.substr(1)}
                secondary={(
                    <Toolbar
                        disableGutters
                        variant="dense"
                        className={classes.admin}
                    >
                        <ListItemIcon>
                            {
                                online
                                    ? <RadioButtonChecked fontSize="small"/>
                                    : <RadioButtonUnchecked fontSize="small" />
                            }
                        </ListItemIcon>
                        <ListItemText
                            color="secondary"
                            primary={username}
                        />
                    </Toolbar>
                )}
                primaryTypographyProps={{
                    variant: 'title',
                    color: 'inherit',
                    noWrap: true,
                }}
                secondaryTypographyProps={{
                    component: 'div',
                }}
            />
            {/* <ListItemSecondaryAction> */}
                <IconButton>
                    <Settings />
                </IconButton>
            {/* </ListItemSecondaryAction> */}
        </ListItem>
    </List>
);

TeamHeader.propTypes = {
    classes: PropTypes.objectOf(PropTypes.string).isRequired,
    teamName: PropTypes.string.isRequired,
    admin: PropTypes.shape({
        username: PropTypes.string.isRequired,
        online: PropTypes.bool.isRequired,
    }).isRequired,
};

export default withStyles(styles)(TeamHeader);
