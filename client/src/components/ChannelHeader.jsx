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
    ListItemIcon,
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
    FiberManualRecord,
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
        height: 30,
        width: 30,
    },
    icon: {
        margin: '0 0 0 1em',
        fontFamily: 'Roboto',
    },
    chatIcon: {
        fontSize: '1em',
        color: theme.palette.primary.main,
        backgroundColor: theme.palette.grey[500],
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 4,
    },
    title: {
        flex: 1,
        flexBasis: '90%',
        padding: `0 ${theme.spacing.unit}px`,
    },
    search: {
        flex: 1,
        flexBasis: 380,
        marginLeft: theme.un
    },
});

const ChannelHeader = ({
    channel: {
        name, description, private: isPrivate, membersCount, dm, online = false,
    }, isMenuOpen, searchText, isMobileSearchOpen, isOwner, isStarred,
    classes, isChannelSidebarOpen, onChange, onSearchSubmit, onStar,
    onMobileSearchToggle, onMenuToggle, onTeamsSidebarToggle, teamName,
    onChannelSidebarToggle, onUpdateToggle, onDeleteToggle,
    onInfoToggle,
}) => {
    const isDefault = name === 'general';
    const searchBtn = (
        <IconButton onClick={onMobileSearchToggle}>
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
            onClick={onMenuToggle}
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
            onClose={onMenuToggle}
            id="channelMenu"
            anchorEl={document.getElementById('channelMenuBtn')}
            anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
            transformOrigin={{ vertical: 'top', horizontal: 'right' }}
        >
            <MenuItem
                onClick={() => {
                    onMenuToggle();
                    onChannelSidebarToggle();
                }}
                children={isChannelSidebarOpen ? 'Hide panel' : 'Open panel'}
            />
            {!isDefault && [
                <MenuItem
                    onClick={() => {
                        onMenuToggle();
                        onStar();
                    }}
                    key="menu-star-channel"
                    children={
                        `${isStarred ? 'Unstar' : 'Star'}
                        ${dm ? 'Chat' : 'Channel'}`
                    }
                />,
                (!dm && [
                    <MenuItem
                        onClick={() => {
                            onMenuToggle();
                            onInfoToggle();
                        }}
                        key="menu-about-channel"
                        children="About Channel"
                    />,
                    <MenuItem
                        key="menu-update-channel"
                        children="Update Channel"
                        onClick={() => {
                            onMenuToggle();
                            onUpdateToggle();
                        }}
                    />,
                ]),
                <MenuItem
                    onClick={() => {
                        onMenuToggle();
                        onDeleteToggle();
                    }}
                    key="menu-delete-channel"
                    children={`Delete ${dm ? 'Chat' : 'Channel'}`}
                />,
            ]}
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
                                    <IconButton onClick={onTeamsSidebarToggle}>
                                        <Avatar className={classes.menuBtn}>
                                            {teamName.charAt(0).toUpperCase()}
                                        </Avatar>
                                    </IconButton>
                                    <ListItemIcon className={classes.icon}>
                                        <React.Fragment>
                                            {dm && (
                                                name.split(',')[1]
                                                    ? (
                                                        <Icon
                                                            className={classes.chatIcon}
                                                            children={<small>{name.split(',').length}</small>}
                                                            fontSize="small"
                                                        />
                                                    ) : (
                                                        <FiberManualRecord
                                                            fontSize="small"
                                                            color={online ? 'secondary' : 'disabled'}
                                                        />
                                                    )
                                            )}
                                            {!dm && (
                                                isPrivate
                                                    ? <Lock fontSize="small" />
                                                    : (
                                                        <Icon
                                                            children="#"
                                                            fontSize="small"
                                                        />
                                                    )
                                            )}
                                        </React.Fragment>
                                    </ListItemIcon>
                                    <ListItemText
                                        className={classes.title}
                                        primary={name}
                                        
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
                                secondary={
                                    dm
                                        ? 'direct chat'
                                        : `${membersCount} participants -
                                            ${isPrivate ? 'private' : 'public'} access - 
                                            ${description || 'no description'}`
                                }
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
                            {
                                !isDefault && (
                                    <Tooltip title={`${isStarred ? 'Unstar' : 'Star'} channel`}>
                                        <IconButton onClick={() => onStar()}>
                                            {isStarred ? <Star /> : <StarBorder />}
                                        </IconButton>
                                    </Tooltip>
                                )
                            }
                            <Tooltip title={`${isChannelSidebarOpen ? 'Hide' : 'Open'} panel`}>
                                <IconButton onClick={onChannelSidebarToggle}>
                                    {isChannelSidebarOpen ? <ViewHeadline /> : <VerticalSplit />}
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
        dm: PropTypes.bool.isRequired,
        membersCount: PropTypes.number.isRequired,
    }).isRequired,
    teamName: PropTypes.string.isRequired,
    isMenuOpen: PropTypes.bool.isRequired,
    isChannelSidebarOpen: PropTypes.bool.isRequired,
    isMobileSearchOpen: PropTypes.bool.isRequired,
    isOwner: PropTypes.bool.isRequired,
    isStarred: PropTypes.bool.isRequired,
    searchText: PropTypes.string.isRequired,
    onTeamsSidebarToggle: PropTypes.func.isRequired,
    onChannelSidebarToggle: PropTypes.func.isRequired,
    onMenuToggle: PropTypes.func.isRequired,
    onUpdateToggle: PropTypes.func.isRequired,
    onInfoToggle: PropTypes.func.isRequired,
    onMobileSearchToggle: PropTypes.func.isRequired,
    onDeleteToggle: PropTypes.func.isRequired,
    onChange: PropTypes.func.isRequired,
    onSearchSubmit: PropTypes.func.isRequired,
    onStar: PropTypes.func.isRequired,
};

export default withStyles(styles)(ChannelHeader);
