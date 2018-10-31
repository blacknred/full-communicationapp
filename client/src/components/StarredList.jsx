import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

import {
    List,
    Chip,
    Icon,
    ListItem,
    ListItemText,
    ListItemIcon,
    ListSubheader,
} from '@material-ui/core';
import { Star, Lock } from '@material-ui/icons';
import { withStyles } from '@material-ui/core/styles';

const styles = theme => ({
    listItem: {
        color: theme.palette.grey[400],
        paddingRight: theme.spacing.unit * 2,
    },
    iconRoot: {
        color: 'inherit',
        width: '0.7em',
        margin: 0,
    },
    chip: {
        height: theme.spacing.unit * 3,
    },
    subheader: {
        display: 'flex',
        alignItems: 'center',
    },
    selected: {
        backgroundColor: `${theme.palette.primary.light}!important`,
    },
});

const StarredList = ({
    classes, teamId, channels, channelId,
}) => {
    const starredList = channels.map(ch => (
        <ListItem
            key={`starred-${ch.id}`}
            button
            component={Link}
            to={`/teams/${teamId}/${ch.id}`}
            className={classes.listItem}
            classes={{ selected: classes.selected }}
            selected={channelId === ch.id}
        >
            <ListItemIcon className={classes.iconRoot}>
                {ch.private ? <Lock /> : <Icon children={<b>#</b>} />}
            </ListItemIcon>
            <ListItemText
                inset
                primary={ch.name}
                primaryTypographyProps={{
                    color: 'inherit',
                }}
            />
            {
                ch.updatesCount > 0 && (
                    <Chip
                        label={ch.updatesCount}
                        color="secondary"
                        className={classes.chip}
                    />
                )
            }
        </ListItem>
    ));

    return (
        <List
            subheader={(
                <ListSubheader
                color="inherit" 
                className={classes.subheader}>
                    <Star className={classes.iconRoot} />
                    &nbsp;
                    {`STARRED (${channels.length})`}
                </ListSubheader>
            )}
        >
            {starredList}
        </List>
    );
};

StarredList.propTypes = {
    classes: PropTypes.objectOf(PropTypes.string).isRequired,
    teamId: PropTypes.number.isRequired,
    channels: PropTypes.arrayOf(PropTypes.shape({
        id: PropTypes.number.isRequired,
        name: PropTypes.string.isRequired,
        private: PropTypes.bool.isRequired,
        updatesCount: PropTypes.number.isRequired,
    })).isRequired,
    channelId: PropTypes.number.isRequired,
};

export default withStyles(styles)(StarredList);
