import React from 'react';
import {
    MuiThemeProvider,
    createMuiTheme,
} from '@material-ui/core/styles';
import PropTypes from 'prop-types';
import { observer, inject } from 'mobx-react';

import { grey } from '@material-ui/core/colors';
import { CssBaseline } from '@material-ui/core';

import colors from '../colors';

const StyleRoot = Component => inject('store')(observer(
    ({ store: { appColor, isNightMode }, ...rest }) => {
        const lightTheme = createMuiTheme({
            palette: {
                background: {
                    default: grey[50],
                },
                type: 'light',
                primary: {
                    main: colors[appColor].light.main,
                },
                secondary: {
                    main: colors[appColor].light.secondary,
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
                    main: colors[appColor].dark.main,
                },
                secondary: {
                    main: colors[appColor].dark.secondary,
                },
            },
        });
        return (
            <MuiThemeProvider theme={isNightMode ? darkTheme : lightTheme}>
                <CssBaseline />
                <Component {...rest} />
            </MuiThemeProvider>
        );
    },
));

StyleRoot.propTypes = {
    Component: PropTypes.element.isRequired,
};

export default (StyleRoot);
