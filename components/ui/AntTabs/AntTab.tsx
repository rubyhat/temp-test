import React from 'react';
import Tab from '@material-ui/core/Tab';
import { withStyles } from '@material-ui/core/styles';

export const AntTab = withStyles(
    theme => ({
        /* Styles applied to the root element. */
        root: {
            minWidth: 72,
            fontWeight: theme.typography.fontWeightBold,

            '&:hover': {
                color: theme.palette.common.black,
                opacity: 0.7,
            },
            '&$selected': {
                color: theme.palette.common.black,
            },
            '&:focus': {
                color: theme.palette.common.black,
            },
        },
    }),
    { name: 'AntTab' }
)((props: AntTabProps) => <Tab disableRipple textColor="primary" {...props} />);

interface AntTabProps {
    label: string;
}
