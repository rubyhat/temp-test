import React, { FC } from 'react';
import clsx from 'clsx';
import { makeStyles } from '@material-ui/core/styles';

import { MilesRewardBadge } from './MilesRewardBadge';
import { Typo } from 'components/Typo/Typo';
import { useTranslation } from 'i18n';

const useStyles = makeStyles(
    () => ({
        /* Styles applied to the root element. */
        root: {},
        container: {
            display: 'flex',
            alignItems: 'center',
        },
        milesRewardText: {},
        MilesRewardBadge: {
            marginLeft: 4,
            flexShrink: 0, // prevent text wrapping
        },
    }),
    { name: 'MilesRewardTextWithBadge' }
);

type MilesRewardTextWithBadgeProps = {
    miles: number;
    className?: string;
};

export const MilesRewardTextWithBadge: FC<
    MilesRewardTextWithBadgeProps
> = props => {
    const { className, miles } = props;
    const classes = useStyles();
    const { t } = useTranslation();

    return (
        <div className={clsx(classes.root, className)}>
            <div className={classes.container}>
                <Typo className={classes.milesRewardText} component="div">
                    {t('milesRewardText')}
                </Typo>

                <MilesRewardBadge
                    className={classes.MilesRewardBadge}
                    miles={miles}
                />
            </div>
        </div>
    );
};
