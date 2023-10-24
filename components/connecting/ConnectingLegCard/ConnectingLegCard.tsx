import React, { FC, useState } from 'react';
import Grid from '@material-ui/core/Grid';
import clsx from 'clsx';
import { makeStyles, Theme } from '@material-ui/core/styles';

import { ConnectingInstructionsDialog } from 'components/connecting/ConnectingInstructionsDialog';
import { ConnectingLegFooter } from './ConnectingLegFooter';
import { ConnectingServiceProvidedBy } from './ConnectingServiceProvidedBy';
import { ConnectingRoute } from 'components/connecting/ConnectingRoute';
import { PriceButton } from 'components/PriceButton';
import { StopOverLegDto } from 'swagger/client';
import { Typo } from 'components/Typo/Typo';
import { currencySymbol } from 'utils/currency';
import { formatPrice } from 'utils/price';
import { usePlatform } from 'hooks/usePlatform';
import { useTranslation } from 'i18n';
import { AtlasTheme } from 'typings/atlas-theme';

export const connectingFooterHiddenAreaHeight = 4;

const useStyles = makeStyles(
    (theme: Theme & AtlasTheme) => ({
        /* Styles applied to the root element. */
        root: {},
        /* Styles applied to the card `div` element. */
        card: {
            backgroundColor: theme.palette.common.white,
            borderRadius: theme.shape.borderRadius,
            boxShadow: theme.atlas.shadows.bottom,
            padding: theme.spacing(2),
            overflow: 'hidden',
            position: 'relative',
        },
        /* Styles applied to the container `Grid` component. */
        container: {},
        /* Styles applied to the spacer `div` element. */
        spacer: {
            flexGrow: 1,
        },
        /* Styles applied to the `ConnectingLegFooter` component. */
        ConnectingLegFooter: {
            paddingTop: connectingFooterHiddenAreaHeight,
            marginTop: -connectingFooterHiddenAreaHeight,
        },
        ConnectingServiceProvidedBy: {
            marginTop: theme.spacing(1),
        },
    }),
    { name: 'ConnectingLegCard' }
);

type ConnectingLegCardProps = {
    className?: string;
    leg: StopOverLegDto;
    passengers: number;
};

export const ConnectingLegCard: FC<ConnectingLegCardProps> = props => {
    const { className, leg, passengers } = props;
    const classes = useStyles();
    const { t } = useTranslation();
    const { isMobile, isDesktop } = usePlatform();

    const { fromName, toName, minPrice, currency } = leg;

    const [directionsDialogOpen, toggleDirectionsDialog] = useState(false);
    const handleBooking = () => {
        if (leg.link) {
            window.open(leg.link, '_blank');
        } else if (leg.directions) {
            toggleDirectionsDialog(true);
        }
    };

    return (
        <div className={clsx(classes.root, className)}>
            <div className={classes.card}>
                <Grid container spacing={2} className={classes.container}>
                    <Grid item md={8}>
                        <ConnectingRoute
                            departureCity={fromName}
                            arrivalCity={toName}
                        />
                    </Grid>

                    <Grid
                        container
                        item
                        md={4}
                        alignItems="flex-start"
                        justify="flex-end"
                    >
                        <Grid item xs={4}>
                            <Typo variant="subtitle" weight="bold">
                                {t('fromPrice', {
                                    price: formatPrice(
                                        minPrice,
                                        currencySymbol[currency]
                                    ),
                                })}
                            </Typo>

                            <Typo color="textSecondary">
                                {t('search:perSeat', {
                                    count: passengers,
                                })}
                            </Typo>
                        </Grid>

                        <Grid item xs={8}>
                            <PriceButton
                                onClick={handleBooking}
                                title={t('search:bookNow')} // @todo Заказать/Выбрать
                                price={minPrice}
                                currency={currency}
                                passengers={passengers}
                                variant="active"
                                fullWidth
                            />

                            {isDesktop ? (
                                <ConnectingServiceProvidedBy
                                    className={
                                        classes.ConnectingServiceProvidedBy
                                    }
                                    leg={leg}
                                />
                            ) : null}
                        </Grid>
                    </Grid>
                </Grid>
            </div>

            {isMobile ? (
                <ConnectingLegFooter
                    className={classes.ConnectingLegFooter}
                    leg={leg}
                />
            ) : null}

            {leg.directions ? (
                <ConnectingInstructionsDialog
                    open={directionsDialogOpen}
                    onClose={() => {
                        document.body.style.overflow = 'auto';
                        toggleDirectionsDialog(false);
                    }}
                    html={leg.directions}
                />
            ) : null}
        </div>
    );
};
