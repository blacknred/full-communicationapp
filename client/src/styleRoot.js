import React from 'react';
import {
    MuiThemeProvider,
    createMuiTheme,
} from '@material-ui/core/styles';
import PropTypes from 'prop-types';
import grey from '@material-ui/core/colors/grey';
import blue from '@material-ui/core/colors/blue';
import teal from '@material-ui/core/colors/teal';
import CssBaseline from '@material-ui/core/CssBaseline';

const lightTheme = createMuiTheme({
    palette: {
        background: {
            default: grey[200],
        },
        type: 'light',
        primary: {
            main: teal[500],
        },
        secondary: {
            main: blue[500],
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
            main: blue[500],
        },
        secondary: {
            main: teal[500],
        },
    },
});

const IS_NIGHT_MODE = false;

const StyleRoot = (Component) => {
    function styleRoot(props) {
        return (
            <MuiThemeProvider theme={IS_NIGHT_MODE ? darkTheme : lightTheme}>
                <CssBaseline />
                <Component {...props} />
            </MuiThemeProvider>
        );
    }
    return styleRoot;
};

StyleRoot.propTypes = {
    Component: PropTypes.element.isRequired,
};

export default StyleRoot;
