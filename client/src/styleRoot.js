import React from 'react';
import {
    MuiThemeProvider,
    createMuiTheme,
} from '@material-ui/core/styles';
import PropTypes from 'prop-types';
import { grey } from '@material-ui/core/colors';
import { CssBaseline } from '@material-ui/core';

import colors from './colors';

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
const COLOR_MODE = 2;

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
        console.log('pt', props);
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
