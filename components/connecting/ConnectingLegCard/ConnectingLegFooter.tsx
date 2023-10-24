import React, { FC } from 'react';
import clsx from 'clsx';
import upperFirst from 'lodash/upperFirst';
import { makeStyles, Theme } from '@material-ui/core/styles';

import { StopOverLegDto } from 'swagger/client';
import { useTranslation } from 'i18n';
import { AtlasTheme } from 'typings/atlas-theme';

export const benefitsHiddenAreaHeight = 4;

const useStyles = makeStyles(
    (theme: Theme & AtlasTheme) => ({
        /* Styles applied to the root element. */
        root: {
            height: 32,
            borderRadius: 3,
            backgroundColor: theme.atlas.palette.background.deepCold,
            boxShadow: theme.atlas.shadows.bottom,
            paddingLeft: theme.spacing(2),
            paddingRight: theme.spacing(2),
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
        },
        /* Styles applied to the executorName `div` element. */
        executorName: {
            fontSize: theme.typography.caption.fontSize,
            color: theme.atlas.palette.text.minor,
        },
    }),
    { name: 'ConnectingLegFooter' }
);

type ConnectingLegFooterProps = {
    leg: StopOverLegDto;
    className?: string;
};

export const ConnectingLegFooter: FC<ConnectingLegFooterProps> = props => {
    const { leg, className } = props;
    const classes = useStyles();
    const { t } = useTranslation();

    return (
        <div className={clsx(classes.root, className)}>
            <div className={classes.executorName}>
                {t(`search:connectingType${upperFirst(leg.type)}`)}
            </div>
        </div>
    );
};
