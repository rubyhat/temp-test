import React, { FC } from 'react';
import Grid from '@material-ui/core/Grid';
import clsx from 'clsx';
import { makeStyles, Theme } from '@material-ui/core/styles';

import { SeoDtoResponse } from 'swagger/client';
import { Typo } from 'components/Typo/Typo';
import { getConnectingCities } from 'sagas/connecting-trips';
import { useTranslation } from 'i18n';
import { AtlasTheme } from 'typings/atlas-theme';

const useStyles = makeStyles(
    (theme: Theme & AtlasTheme) => ({
        /* Styles applied to the root element. */
        root: {
            backgroundColor: theme.atlas.palette.background.disabled,
            boxShadow: theme.atlas.shadows.bottom,
            borderRadius: theme.shape.borderRadius,
            padding: theme.spacing(2),
        },
        /* Styles applied to the connecting block title `Typo` component. */
        title: {
            lineHeight: 1.5,
        },
        /* Styles applied to the connecting block subtitle `Typo` component. */
        subtitle: {
            // lineHeight: 1.5,
            // marginTop: theme.spacing(1),
        },
        /* Styles applied to the description block `div` component. */
        descriptionBlock: {
            lineHeight: 1.5,
            marginTop: theme.spacing(1),
        },
        /* Styles applied to the description `Typo` component. */
        description: {
            lineHeight: 1.5,
            marginTop: theme.spacing(1),
        },
    }),
    { name: 'ConnectingSeoBlock' }
);

type ConnectingSeoBlockProps = {
    className?: string;
    seoDirection: SeoDtoResponse;
};

export const ConnectingSeoBlock: FC<ConnectingSeoBlockProps> = props => {
    const { className, seoDirection } = props;
    const classes = useStyles();
    const { t } = useTranslation();

    const { fromName, toName, stopOver } = seoDirection;
    const connectingCities = stopOver && getConnectingCities(stopOver.legs);

    return (
        <div className={clsx(classes.root, className)}>
            <Typo variant="subtitle" weight="bold" className={classes.title}>
                {t('search:connectingSeoBlockTitle', {
                    from: fromName,
                    to: toName,
                })}
            </Typo>

            {/* @todo вернуть когда будет расстояние и время в пути */}
            {/*<Typo*/}
            {/*    variant="body1"*/}
            {/*    color="textSecondary"*/}
            {/*    className={classes.subtitle}*/}
            {/*>*/}
            {/*    {t('search:connectingSeoBlockSubtitle', {*/}
            {/*        distance: '~xxx км', // @todo distance,*/}
            {/*        duration: '~xx часов', // @todo duration*/}
            {/*    })}*/}
            {/*</Typo>*/}

            <Grid container spacing={4}>
                <Grid item md={6}>
                    <Typo variant="body1" className={classes.description}>
                        <div
                            dangerouslySetInnerHTML={{
                                __html: t(
                                    'search:connectingSeoBlockDescription1',
                                    {
                                        fromCity: fromName,
                                        toCity: toName,
                                    }
                                ),
                            }}
                        />
                    </Typo>
                </Grid>

                <Grid item md={6}>
                    <Typo variant="body1" className={classes.description}>
                        <div
                            dangerouslySetInnerHTML={{
                                __html: t(
                                    'search:connectingSeoBlockDescription2',
                                    {
                                        fromCity: fromName,
                                        toCity: toName,
                                        connectingCity: connectingCities,
                                    }
                                ),
                            }}
                        />
                    </Typo>
                </Grid>
            </Grid>
        </div>
    );
};
