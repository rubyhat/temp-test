import React, { FC } from 'react';
import clsx from 'clsx';
import { makeStyles } from '@material-ui/core/styles';
import MuiRating, {
    RatingProps as MuiRatingProps,
} from '@material-ui/lab/Rating';

const useStyles = makeStyles(
    theme => ({
        /* Styles applied to the root element. */
        root: {
            color: theme.palette.primary.main,
        },
        /* Styles applied to the root element if `size="small"`. */
        sizeSmall: {
            fontSize: theme.typography.pxToRem(18),
        },
        /* Styles applied to the root element if `size="medium"`. */
        sizeMedium: {
            fontSize: theme.typography.pxToRem(24),
        },
        /* Styles applied to the root element if `size="large"`. */
        sizeLarge: {
            fontSize: theme.typography.pxToRem(30),
        },
        /* Styles applied to the root element if `size="xl"`. */
        sizeXL: {
            fontSize: theme.typography.pxToRem(36),
        },
    }),
    { name: 'Rating' }
);

type RatingProps = Omit<MuiRatingProps, 'size'> & {
    /**
     * The size of the rating.
     */
    size: 'small' | 'medium' | 'large' | 'xl';
};

export const Rating: FC<RatingProps> = props => {
    const { size = 'medium', className, ...other } = props;
    const classes = useStyles();

    return (
        <MuiRating
            className={clsx(classes.root, className, {
                [classes.sizeSmall]: size === 'small',
                [classes.sizeMedium]: size === 'medium',
                [classes.sizeLarge]: size === 'large',
                [classes.sizeXL]: size === 'xl',
            })}
            {...other}
        />
    );
};
