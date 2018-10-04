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

const colors = [
    {
        // browny
        main: '#473544',
        secondary: red[400],
    },
    {
        // ocean
        main: '#484d6b',
        secondary: blue[400],
    },
    {
        // green day
        main: blueGrey[800],
        secondary: '#009688',
    },
];

const lightTheme = createMuiTheme({
    palette: {
        background: {
            default: grey[50],
        },
        type: 'light',
        primary: {
            main: colors[1].main,
        },
        secondary: {
            main: colors[1].secondary,
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
            main: colors[0].main,
        },
        secondary: {
            main: colors[0].secondary,
        },
    },
});

const IS_NIGHT_MODE = false;

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
