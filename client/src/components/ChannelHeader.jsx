import React from 'react';
import PropTypes from 'prop-types';

import {
    Fade,
    Chip,
    Hidden,
    AppBar,
    Toolbar,
    IconButton,
    Typography,
} from '@material-ui/core';
import {
    Menu,
    Lock,
    LockOpen,
    MoreVert,
    MoreHoriz,
    RadioButtonChecked,
    RadioButtonUnchecked,
} from '@material-ui/icons';
import { withStyles } from '@material-ui/core/styles';

import {
    GET_TEAMS_QUERY,
    GET_TEAM_MEMBERS_QUERY,
    ADD_TEAM_MEMBER_MUTATION,
} from '../graphql/channel';

const styles = theme => ({
    title: {
        flex: 1,
        marginLeft: theme.spacing.unit * 2,
    },
    appBar: {
        backgroundColor: theme.palette.background.paper, // default,
        // boxShadow: `-3px -2px 15px 0px ${theme.palette.primary.main}`,
    },
});

const ChannelHeader = ({ classes, title, status }) => (
    <Fade in>
        <AppBar
            elevation={1}
            position="relative"
            color="default"
            className={classes.appBar}
        >
            <Toolbar>
                <Hidden mdUp>
                    <IconButton>
                        <Menu />
                    </IconButton>
                </Hidden>
                <Hidden smDown>
                    <Chip
                        label={status}
                        clickable
                        color="secondary"
                        variant="outlined"
                    />
                </Hidden>
                <Typography
                    variant="title"
                    color="secondary"
                    noWrap
                    className={classes.title}
                >
                    {`#${title}`}
                </Typography>
                <Hidden mdUp>
                    <IconButton>
                        {status === 'Online' && <RadioButtonChecked fontSize="small" />}
                        {status === 'Offline' && <RadioButtonUnchecked fontSize="small" />}
                        {status === 'Public' && <LockOpen fontSize="small" />}
                        {status === 'Private' && <Lock fontSize="small" />}
                    </IconButton>
                </Hidden>
                <IconButton>
                    <Hidden mdUp>
                        <MoreVert />
                    </Hidden>
                    <Hidden smDown>
                        <MoreHoriz />
                    </Hidden>
                </IconButton>
            </Toolbar>
        </AppBar>
    </Fade>
);

ChannelHeader.propTypes = {
    classes: PropTypes.objectOf(PropTypes.string).isRequired,
    title: PropTypes.string.isRequired,
    status: PropTypes.string.isRequired,
};

export default withStyles(styles)(ChannelHeader);
