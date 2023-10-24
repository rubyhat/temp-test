import React from 'react';
import Tabs from '@material-ui/core/Tabs';
import { withStyles } from '@material-ui/core/styles';

export const AntTabs = withStyles(
    theme => ({
        /* Styles applied to the root element. */
        root: {
            borderBottom: `1px solid ${theme.palette.divider}`,
        },
        indicator: {
            backgroundColor: theme.palette.common.black,
        },
    }),
    { name: 'AntTabs' }
)(Tabs);
