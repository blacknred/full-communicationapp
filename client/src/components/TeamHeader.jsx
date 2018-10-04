import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

import {
    List,
    ListItem,
    Typography,
    ListItemIcon,
} from '@material-ui/core';
import { FiberManualRecord } from '@material-ui/icons';
import { withStyles } from '@material-ui/core/styles';

const styles = theme => ({
    admin: {
        paddingTop: theme.spacing.unit / 2,
        color: theme.palette.secondary.light,
        '& svg': {
            color: 'inherit',
        },
        '& a': {
            textDecoration: 'none',
        },
    },
});

const TeamHeader = ({
    classes, teamId, teamName, admin: { id, username },
}) => (
    <List>
        <ListItem dense>
            <Typography
                variant="headline"
                color="inherit"
            >
                {
                    teamName.charAt(0).toUpperCase()
                    + teamName.substr(1)
                }
            </Typography>
        </ListItem>
        <ListItem className={classes.admin}>
            <ListItemIcon>
                <FiberManualRecord fontSize="small" />
            </ListItemIcon>
            <Typography
                component={Link}
                color="inherit"
                to={`/teams/${teamId}/user/${id}`}
            >
                {username}
            </Typography>
        </ListItem>
    </List>
);

TeamHeader.propTypes = {
    classes: PropTypes.objectOf(PropTypes.string).isRequired,
    teamId: PropTypes.number.isRequired,
    teamName: PropTypes.string.isRequired,
    admin: PropTypes.shape({
        id: PropTypes.number.isRequired,
        username: PropTypes.string.isRequired,
    }).isRequired,
};

export default withStyles(styles)(TeamHeader);
