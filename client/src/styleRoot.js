import React from 'react';
import {
    MuiThemeProvider,
    createMuiTheme,
} from '@material-ui/core/styles';
import PropTypes from 'prop-types';
import {
    grey, red, blue, blueGrey,
} from '@material-ui/core/colors';
import { CssBaseline } from '@material-ui/core';

const styles = {
    appFrame: {
        height: '100vh',
        zIndex: 1,
        overflow: 'hidden',
        position: 'relative',
        display: 'flex',
        width: '100%',
    },
};

const IS_NIGHT_MODE = false;
const COLOR_MODE = 'ocean';

const colors = {
    browny: {
        light: {
            main: '#473544',
            secondary: red[400],
        },
        dark: {
            main: '#473544',
            secondary: red[400],
        },
    },
    ocean: {
        light: {
            main: '#484d6b',
            secondary: blue[400],
        },
        dark: {
            main: '#484d6b',
            secondary: blue[400],
        },
    },
    green_day: {
        light: {
            main: blueGrey[800],
            secondary: '#009688',
        },
        dark: {
            main: blueGrey[800],
            secondary: '#009688',
        },
    },
};

const lightTheme = createMuiTheme({
    palette: {
        background: {
            default: grey[50],
        },
        type: 'light',
        primary: {
            main: colors[COLOR_MODE].light.main,
        },
        secondary: {
            main: colors[COLOR_MODE].light.secondary,
        },
    },
});

const darkTheme = createMuiTheme({
    palette: {
        background: {
            default: grey[900],
        },
        type: 'dark',
        primary: {
            main: colors[COLOR_MODE].dark.main,
        },
        secondary: {
            main: colors[COLOR_MODE].dark.secondary,
        },
    },
});

const StyleRoot = (Component) => {
    function styleRoot(props) {
        return (
            <MuiThemeProvider theme={IS_NIGHT_MODE ? darkTheme : lightTheme}>
                <CssBaseline />
                <div style={styles.appFrame}>
                    <Component {...props} />
                </div>
            </MuiThemeProvider>
        );
    }
    return styleRoot;
};

StyleRoot.propTypes = {
    Component: PropTypes.element.isRequired,
};

export default StyleRoot;
