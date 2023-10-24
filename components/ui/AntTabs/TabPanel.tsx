import React, { FC, ReactNode } from 'react';
import Box, { BoxProps } from '@material-ui/core/Box';
import clsx from 'clsx';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles(
    theme => ({
        /* Styles applied to the root element. */
        root: {},
    }),
    { name: 'TabPanel' }
);

type TabPanelProps = {
    className?: string;
    children?: ReactNode;
    index: any;
    value: any;
    tabName?: string;
    BoxProps?: BoxProps;
};

export const TabPanel: FC<TabPanelProps> = props => {
    const classes = useStyles();

    const {
        children,
        value,
        index,
        tabName = 'tabpanel',
        className,
        BoxProps,
        ...other
    } = props;

    return (
        <div
            className={clsx(classes.root, className)}
            role="tabpanel"
            hidden={value !== index}
            id={`${tabName}-${index}`}
            aria-labelledby={`${tabName}-${index}`}
            {...other}
        >
            {value === index && (
                <Box p={2} {...BoxProps}>
                    {children}
                </Box>
            )}
        </div>
    );
};
