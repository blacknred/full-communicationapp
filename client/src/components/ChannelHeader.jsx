import React from 'react';
import PropTypes from 'prop-types';

import {
    Icon,
    Menu,
    Slide,
    Input,
    Avatar,
    Hidden,
    AppBar,
    Toolbar,
    Tooltip,
    Divider,
    MenuItem,
    IconButton,
    ListItemText,
    InputAdornment,
} from '@material-ui/core';
import {
    Lock,
    Star,
    Search,
    MoreVert,
    MoreHoriz,
    ArrowBack,
    StarBorder,
    ViewHeadline,
    VerticalSplit,
} from '@material-ui/icons';
import { withStyles } from '@material-ui/core/styles';

const ENTER_KEY = 13;

const styles = theme => ({
    appBar: {
        backgroundColor: theme.palette.background.default,
        // boxShadow: `-3px -2px 15px 0px ${theme.palette.primary.main}`,
    },
    menuBtn: {
        backgroundColor: theme.palette.primary.light,
        height: 33,
        width: 33,
    },
    title: {
        flex: 1,
        flexBasis: '90%',
    },
    search: {
        flex: 1,
        flexBasis: theme.spacing.unit * 35,
    },
});

const ChannelHeader = ({
    channel: {
        name, description, private: isPrivate, participantsCount,
    }, isMenuOpen, searchText, isMobileSearchOpen, isOwner, isStarred,
    classes, isDrawerOpen, onToggle, onChange, onSearchSubmit, onStar,
}) => {
    const searchBtn = (
        <IconButton onClick={() => onToggle('isMobileSearchOpen')}>
            {isMobileSearchOpen ? <ArrowBack /> : <Search />}
        </IconButton>
    );
    const searchBlock = (
        <Input
            autoFocus={isMobileSearchOpen}
            disableUnderline
            id="channels-search"
            type="text"
            name="searchText"
            value={searchText}
            placeholder={`Search in #${name}...`}
            className={classes.search}
            onChange={onChange}
            onKeyDown={e => e.keyCode === ENTER_KEY && onSearchSubmit()}
            startAdornment={
                !isMobileSearchOpen && (
                    <InputAdornment position="start">
                        <Search color="disabled" />
                    </InputAdornment>
                )}
        />
    );
    const channelMenuBtn = isOwner && (
        <IconButton
            id="channelMenuBtn"
            aria-owns="channelMenu"
            aria-haspopup="true"
            onClick={() => onToggle('isMenuOpen')}
        >
            <Hidden smUp>
                <MoreVert />
            </Hidden>
            <Hidden only="xs">
                <MoreHoriz />
            </Hidden>
        </IconButton>
    );
    const channelMenu = (
        <Menu
            open={isMenuOpen}
            onClose={() => onToggle('isMenuOpen')}
            anchorEl={document.getElementById('channelMenuBtn')}
            anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
            transformOrigin={{ vertical: 'top', horizontal: 'right' }}
        >
            <MenuItem
                onClick={() => {
                    onStar(!isStarred);
                    onToggle('isMenuOpen');
                }}
            >
                {isStarred ? 'Unstar Channel' : 'Star Channel'}
            </MenuItem>
            <MenuItem
                onClick={() => {
                    onToggle('isDrawerOpen');
                    onToggle('isMenuOpen');
                }}
            >
                {isDrawerOpen ? 'Hide panel' : 'Open panel'}
            </MenuItem>
            <MenuItem
                onClick={() => {
                    onToggle('isChannelUpdateFormOpen');
                    onToggle('isMenuOpen');
                }}
            >
                {`${description ? 'Update' : 'Add'} description`}
            </MenuItem>
            <MenuItem
                onClick={() => {
                    onToggle('isChannelUpdateFormOpen');
                    onToggle('isMenuOpen');
                }}
            >
                Update Channel
            </MenuItem>
            <MenuItem
                onClick={() => {
                    onToggle('isChannelDeleteWarningFormOpen');
                    onToggle('isMenuOpen');
                }}
            >
                Delete Channel
            </MenuItem>
            <MenuItem
                onClick={() => {
                    onToggle('isMenuOpen');
                }}
            >
                About Channel
            </MenuItem>
        </Menu>
    );

    return (
        <Slide in direction="down">
            <React.Fragment>
                <AppBar
                    elevation={0}
                    position="relative"
                    color="inherit"
                    className={classes.appBar}
                >
                    <Toolbar>
                        <Hidden mdUp>
                            {isMobileSearchOpen && searchBtn}
                            {isMobileSearchOpen ? searchBlock : (
                                <React.Fragment>
                                    <IconButton>
                                        <Avatar className={classes.menuBtn}>
                                            {name.charAt(0).toUpperCase()}
                                        </Avatar>
                                    </IconButton>
                                    <ListItemText
                                        className={classes.title}
                                        primary={(
                                            <React.Fragment>
                                                {
                                                    isPrivate
                                                        ? <Lock fontSize="small" />
                                                        : <Icon children="#" />
                                                }
                                                &nbsp;
                                                {name}
                                            </React.Fragment>
                                        )}
                                        primaryTypographyProps={{
                                            noWrap: true,
                                            variant: 'h6',
                                            color: 'textSecondary',
                                        }}
                                    />
                                </React.Fragment>
                            )}
                            {!isMobileSearchOpen && searchBtn}
                            {!isMobileSearchOpen && channelMenuBtn}
                        </Hidden>
                        <Hidden smDown>
                            <ListItemText
                                color="secondary"
                                className={classes.title}
                                primary={`#${name}`}
                                secondary={`${participantsCount} participants -
                                ${isPrivate ? 'private' : 'public'} access - 
                                ${description || 'no description'}`}
                                primaryTypographyProps={{
                                    noWrap: true,
                                    variant: 'h6',
                                }}
                                secondaryTypographyProps={{
                                    noWrap: true,
                                    variant: 'body2',
                                }}
                            />
                            {searchBlock}
                            <Tooltip title={`${isStarred ? 'Unstar' : 'Star'} channel`}>
                                <IconButton onClick={() => onStar()}>
                                    {isStarred ? <Star /> : <StarBorder />}
                                </IconButton>
                            </Tooltip>
                            <Tooltip title={`${isDrawerOpen ? 'Hide' : 'Open'} panel`}>
                                <IconButton onClick={() => onToggle('isDrawerOpen')}>
                                    {isDrawerOpen ? <ViewHeadline /> : <VerticalSplit />}
                                </IconButton>
                            </Tooltip>
                            {channelMenuBtn}
                        </Hidden>
                    </Toolbar>
                    {channelMenu}
                </AppBar>
                <Divider light />
            </React.Fragment>
        </Slide>
    );
};

ChannelHeader.propTypes = {
    classes: PropTypes.objectOf(PropTypes.string).isRequired,
    channel: PropTypes.shape({
        name: PropTypes.string.isRequired,
        description: PropTypes.string,
        private: PropTypes.bool.isRequired,
        participantsCount: PropTypes.number.isRequired,
    }).isRequired,
    isMenuOpen: PropTypes.bool.isRequired,
    isDrawerOpen: PropTypes.bool.isRequired,
    isMobileSearchOpen: PropTypes.bool.isRequired,
    isOwner: PropTypes.bool.isRequired,
    isStarred: PropTypes.bool.isRequired,
    searchText: PropTypes.string.isRequired,
    onToggle: PropTypes.func.isRequired,
    onChange: PropTypes.func.isRequired,
    onSearchSubmit: PropTypes.func.isRequired,
    onStar: PropTypes.func.isRequired,
};

export default withStyles(styles)(ChannelHeader);
