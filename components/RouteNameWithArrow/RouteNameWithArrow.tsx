import React, { FC } from 'react';
import ArrowForwardIcon from '@material-ui/icons/ArrowForward';
import Box from '@material-ui/core/Box';
import clsx from 'clsx';
import { makeStyles, Theme } from '@material-ui/core/styles';

import { useTranslation } from 'i18n';
import { AtlasTheme } from 'typings/atlas-theme';

const useStyles = makeStyles(
    (theme: Theme & AtlasTheme) => ({
        /* Styles applied to the root element. */
        root: {},
        /* Styles applied to the arrow icon. */
        icon: {
            marginLeft: theme.spacing(0.5),
            marginRight: theme.spacing(0.5),
            color: theme.atlas.palette.icons.secondary,
        },
    }),
    { name: 'RouteNameWithArrow' }
);

type RouteNameWithArrowProps = {
    className?: string;
    departure: string;
    arrival: string;
};

export const RouteNameWithArrow: FC<RouteNameWithArrowProps> = props => {
    const { className, departure, arrival } = props;
    const classes = useStyles();
    const { t } = useTranslation();

    return (
        <div className={clsx(classes.root, className)}>
            <Box display="flex" alignItems="center">
                <span>{departure}</span>
                {
                    <ArrowForwardIcon
                        className={classes.icon}
                        fontSize="small"
                        color="secondary"
                    />
                }
                <span>{arrival}</span>
            </Box>
        </div>
    );
};
