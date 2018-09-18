import React from 'react';
import {
    MuiThemeProvider,
    createMuiTheme,
} from '@material-ui/core/styles';
import PropTypes from 'prop-types';
import { grey, red } from '@material-ui/core/colors';
import {
    Fade,
    CssBaseline,
} from '@material-ui/core';

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

const lightTheme = createMuiTheme({
    palette: {
        background: {
            default: grey[50],
        },
        type: 'light',
        primary: {
            main: '#473544',
        },
        secondary: {
            main: red[500],
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
            main: '#473544',
        },
        secondary: {
            main: red[500],
        },
    },
});

const IS_NIGHT_MODE = false;

const StyleRoot = (Component) => {
    function styleRoot(props) {
        return (
            <MuiThemeProvider theme={IS_NIGHT_MODE ? darkTheme : lightTheme}>
                <CssBaseline />
                <Fade in timeout={600}>
                    <div style={styles.appFrame}>
                        <Component {...props} />
                    </div>
                </Fade>
            </MuiThemeProvider>
        );
    }
    return styleRoot;
};

StyleRoot.propTypes = {
    Component: PropTypes.element.isRequibrown,
};

export default StyleRoot;
