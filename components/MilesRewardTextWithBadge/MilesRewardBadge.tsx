import React, { FC } from 'react';
import clsx from 'clsx';
import { makeStyles, Theme } from '@material-ui/core/styles';

import { useTranslation } from 'i18n';
import { AtlasTheme } from 'typings/atlas-theme';

const useStyles = makeStyles(
    (theme: Theme & AtlasTheme) => ({
        /* Styles applied to the root element. */
        root: {
            borderRadius: 1000,
            background: theme.atlas.gradients.blue,
            color: theme.palette.common.white,
            fontSize: theme.atlas.typography.body5.fontSize,
            fontWeight: 600,
            lineHeight: 1,
            paddingLeft: theme.spacing(1),
            paddingRight: theme.spacing(1),
            paddingTop: 4,
            paddingBottom: 4,
        },
    }),
    { name: 'MilesRewardBadge' }
);

type MilesRewardBadgeProps = {
    miles: number;
    className?: string;
};

export const MilesRewardBadge: FC<MilesRewardBadgeProps> = props => {
    const { className, miles } = props;
    const classes = useStyles();
    const { t } = useTranslation();

    const milesTranslation = t('miles', {
        count: miles,
    });

    return (
        <div className={clsx(classes.root, className)}>
            {`${miles} ${milesTranslation}`}
        </div>
    );
};
