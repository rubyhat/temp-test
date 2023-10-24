import React, { FC, ReactNode } from 'react';
import Box from '@material-ui/core/Box';
import clsx from 'clsx';
import { makeStyles, Theme } from '@material-ui/core/styles';

import SurgeIcon from 'components/icons/Surge';
import { Button, Props as ButtonProps } from '../ui/Button/Button';
import { CurrencySymbol, currencySymbol } from 'utils/currency';
import { SearchDto, SearchDtoFlightPopularEnum } from 'swagger/client';
import { Stub } from '../Stub/Stub';
import { rideMinPrice } from 'utils/ride';
import { usePlatform } from 'hooks/usePlatform';
import { useSAAS } from 'hooks/useSAAS';
import { useTranslation } from 'i18n';
import { AtlasTheme } from 'typings/atlas-theme';

type BookingButtonProps = Omit<
    ButtonProps,
    'color' | 'disabled' | 'variant' | 'subtitle'
> & {
    ride: SearchDto;
    passengers: number;
    title?: ReactNode;
    subtitle?: ReactNode;
};

const useStyles = makeStyles(
    (theme: Theme & AtlasTheme) => ({
        /* Styles applied to the root `Button` component. */
        root: {
            borderRadius: 0,
        },
        /* Pseudo-class applied to the `Button` component if `variant="default"`. */
        buttonDefault: {
            backgroundColor: theme.palette.common.white,
            color: theme.palette.primary.main,
            borderLeft: `1px solid ${theme.atlas.palette.divider.separator}`,
        },
        /* Styles applied to the `Button` component if `freeSeats == 0`. */
        buttonNoSeats: {},
        /* Styles applied to the `Button` component if ride is surged. */
        buttonSurged: {
            background: theme.atlas.gradients.purple,

            '&:hover': {
                backgroundColor: 'unset',
            },
        },
        /* Styles applied to the `Button` component if `rideType == "dynamic"` (d2d). */
        buttonDynamicRide: {
            background: theme.atlas.gradients.blueDark,
        },
        /* Styles applied to the title `Box` element. */
        title: {
            ...theme.atlas.typography.body1,
            fontWeight: theme.typography.fontWeightBold,
        },
        /* Styles applied to the subtitle `Box` element. */
        subtitle: {
            ...theme.atlas.typography.caption,
            fontWeight: 400,
            opacity: 0.64,
        },
        /* Pseudo-class applied to the subtitle `Box` element if `variant="default"`. */
        subtitleDefault: {
            color: theme.atlas.palette.text.trinity,
            opacity: 1, // reset opacity
        },
        /* Styles applied to the `SurgeIcon` component. */
        surgeIcon: {
            position: 'absolute',
            top: -24 / 2, // icon height
            left: -24 / 2, // icon width
        },
    }),
    { name: 'BookingButton' }
);

type BookingButtonVariant = 'default' | 'no-seats' | 'dynamic-mode' | 'surged';

export const BookingButton: FC<BookingButtonProps> = props => {
    const { passengers, title, subtitle, ride, ...rest } = props;
    const classes = useStyles(props);
    const { t } = useTranslation();
    const { isMobile, isCordova } = usePlatform();
    const { meta, isAtlas, isMioTaxi } = useSAAS();

    const { freeSeats, currency, flightPopular, dynamicMode } = ride;
    const price = rideMinPrice(ride.price, ride.onlinePrice, ride.paymentTypes);

    const isSurged =
        flightPopular === SearchDtoFlightPopularEnum.NUMBER_1 &&
        !meta.surgeDisabled &&
        (isMobile || isCordova);

    let variant: BookingButtonVariant =
        freeSeats === 0
            ? 'no-seats'
            : isSurged
            ? 'surged'
            : dynamicMode
            ? 'dynamic-mode'
            : 'default';

    const isDisabled = variant === 'no-seats';

    const renderBody = () => {
        if (variant === 'no-seats') {
            return t('search:noSeats');
        } else {
            return (
                <>
                    <div>
                        <Box
                            className={classes.title}
                            display="flex"
                            alignItems="center"
                            justifyContent="space-around"
                        >
                            {variant === 'surged' ? (
                                <SurgeIcon
                                    className={classes.surgeIcon}
                                    color="purple"
                                />
                            ) : null}

                            <span>
                                {title
                                    ? title
                                    : t('search:pricePerSeat', {
                                          price,
                                          count: passengers,
                                          currency:
                                              currencySymbol[
                                                  currency as CurrencySymbol
                                              ],
                                      })}
                            </span>
                        </Box>
                        {isMioTaxi && (
                            <Box
                                className={clsx(classes.subtitle, {
                                    [classes.subtitleDefault]:
                                        variant === 'default',
                                })}
                            >
                                Заказать шеринг такси
                            </Box>
                        )}
                        {freeSeats && !isMioTaxi ? (
                            <Box
                                className={clsx(classes.subtitle, {
                                    [classes.subtitleDefault]:
                                        variant === 'default',
                                })}
                            >
                                {subtitle
                                    ? subtitle
                                    : t('search:freeCountSeats', {
                                          count: freeSeats >= 5 ? 5 : freeSeats,
                                          plus: freeSeats > 5 ? '+' : '',
                                      })}
                            </Box>
                        ) : null}
                    </div>
                    {isDisabled ? <Stub absolute /> : null}
                </>
            );
        }
    };

    return (
        <Button
            className={clsx(classes.root, {
                [classes.buttonDefault]: variant === 'default',
                [classes.buttonNoSeats]: variant === 'no-seats',
                [classes.buttonSurged]: variant === 'surged',
                [classes.buttonDynamicRide]:
                    variant === 'dynamic-mode' && isAtlas,
                // проверка isAtlas нужна чтобы не переписать
                // цвет кнопки (theme.primary) градиентом у партнеров
            })}
            variant={variant === 'default' ? 'text' : 'contained'}
            color="primary"
            disabled={isDisabled}
            {...rest}
        >
            {renderBody()}
        </Button>
    );
};
