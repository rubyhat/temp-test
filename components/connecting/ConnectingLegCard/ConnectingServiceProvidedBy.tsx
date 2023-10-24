import React, { FC } from 'react';
import clsx from 'clsx';
import upperFirst from 'lodash/upperFirst';
import { makeStyles, Theme } from '@material-ui/core/styles';

import { StopOverLegDto } from 'swagger/client';
import { useTranslation } from 'i18n';
import { AtlasTheme } from 'typings/atlas-theme';

const useStyles = makeStyles(
    (theme: Theme & AtlasTheme) => ({
        /* Styles applied to the root element. */
        root: {
            textAlign: 'center',
            color: theme.atlas.palette.text.minor,
            lineHeight: 1,
        },
    }),
    { name: 'ConnectingServiceProvidedBy' }
);

type ConnectingServiceProvidedByProps = {
    leg: StopOverLegDto;
    className?: string;
};

export const ConnectingServiceProvidedBy: FC<
    ConnectingServiceProvidedByProps
> = props => {
    const { className, leg } = props;
    const classes = useStyles();
    const { t } = useTranslation();

    return (
        <div className={clsx(classes.root, className)}>
            {t('search:connectingServiceProvidedBy', {
                partnerName: t(`search:connectingType${upperFirst(leg.type)}`),
            })}
        </div>
    );
};
