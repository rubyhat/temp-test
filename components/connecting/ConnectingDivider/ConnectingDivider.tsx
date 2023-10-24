import React, { FC } from 'react';
import clsx from 'clsx';
import { makeStyles } from '@material-ui/core/styles';

import { StopOverLegDto } from 'swagger/client';
import { Typo } from 'components/Typo/Typo';
import { useTranslation } from 'i18n';

const useStyles = makeStyles(
    theme => ({
        /* Styles applied to the root element. */
        root: {
            textAlign: 'center',
        },
        /* Styles applied to the container `div` element. */
        container: {
            display: 'inline-flex',
            alignItems: 'center',
        },
        /* Styles applied to the connectingWaitingFrom `Typo` component. */
        connectingWaitingFrom: {
            marginLeft: theme.spacing(1),
        },
    }),
    { name: 'ConnectingDivider' }
);

type ConnectingDividerProps = {
    className?: string;
    leg: StopOverLegDto;
};

export const ConnectingDivider: FC<ConnectingDividerProps> = props => {
    const { className, leg } = props;
    const classes = useStyles();
    const { t } = useTranslation();

    return (
        <div className={clsx(classes.root, className)}>
            <div className={classes.container}>
                <Typo weight="bold">
                    {t('search:connectingInCity', {
                        city: leg.fromName,
                    })}
                </Typo>

                {/* @todo вернуть когда-то */}
                {/*<Typo*/}
                {/*    className={classes.connectingWaitingFrom}*/}
                {/*    color="textSecondary"*/}
                {/*>*/}
                {/*    {t('search:connectingWaitingFrom', {*/}
                {/*        time: leg.travelTime,*/}
                {/*    })}*/}
                {/*</Typo>*/}
            </div>
        </div>
    );
};
