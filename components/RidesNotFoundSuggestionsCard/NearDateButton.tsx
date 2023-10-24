import React, { FC } from 'react';
import Button, { ButtonProps } from '@material-ui/core/Button';
import clsx from 'clsx';
import { fade, makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles(
    theme => ({
        /* Styles applied to the root element. */
        root: {},
        /* Styles applied to the root element if `variant="outlined"` and `color="primary"`. */
        outlinedPrimary: {
            border: `1px solid ${theme.palette.primary.main}`,
            '&:active': {
                backgroundColor: fade(theme.palette.primary.main, 0.16),
            },
        },
    }),
    { name: 'NearDateButton' }
);

type NearDateButtonProps = ButtonProps;

export const NearDateButton: FC<NearDateButtonProps> = props => {
    const { className, children, ...other } = props;
    const classes = useStyles();

    return (
        <Button
            {...other}
            className={clsx(classes.root, className)}
            classes={{
                outlinedPrimary: classes.outlinedPrimary,
            }}
            variant="outlined"
            color="primary"
        >
            {children}
        </Button>
    );
};
