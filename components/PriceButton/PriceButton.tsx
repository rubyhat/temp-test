import React, { FC, ReactNode } from 'react';
import Box from '@material-ui/core/Box';
import { fade, makeStyles, Theme } from '@material-ui/core/styles';
import clsx from 'clsx';

import { Button, Props as ButtonProps } from '../ui/Button/Button';
import { Stub } from '../Stub/Stub';
import { useTranslation } from 'i18n';
import { CurrencySymbol, currencySymbol } from 'utils/currency';
import { SearchDtoFlightPopularEnum } from 'swagger/client';
import { usePlatform } from 'hooks/usePlatform';
import SurgeIcon from 'components/icons/Surge';
import { useSAAS } from 'hooks/useSAAS';
import { AtlasTheme } from 'typings/atlas-theme';

type Props = Omit<
    ButtonProps,
    'color' | 'disabled' | 'variant' | 'subtitle'
> & {
    price?: number;
    freeSeats?: number;
    passengers?: number;
    currency?: CurrencySymbol;
    variant?: 'active' | 'loading' | 'no-seats';
    title?: ReactNode;
    subtitle?: ReactNode;
    flightPopular?: SearchDtoFlightPopularEnum;
    dynamicRide?: boolean;
};

const useStyles = makeStyles(
    (theme: Theme & AtlasTheme) => ({
        /* Styles applied to the title `Box` element. */
        title: {
            ...theme.atlas.typography.body1,
        },
        /* Styles applied to the subtitle `Box` element. */
        subtitle: {
            ...theme.atlas.typography.caption,
            fontWeight: 400,
            opacity: 0.64,
        },
        /* Styles applied to the subtitle `Box` element if `variant="loading"`. */
        subtitleLoading: {
            opacity: 1,
        },
        surgeIcon: {
            position: 'absolute',
            top: -24 / 2, // icon height
            left: -24 / 2, // icon width
        },
        /* Styles applied to the `Button` component if `rideType == "dynamic"` (d2d). */
        buttonDynamicRide: {
            background: theme.atlas.gradients.blueDark,
        },
        buttonSurged: {
            background: theme.atlas.gradients.purple,

            '&:hover': {
                backgroundColor: 'unset',
            },
        },
    }),
    { name: 'PriceButton' }
);

export const PriceButton: FC<Props> = props => {
    const {
        price,
        freeSeats,
        passengers,
        currency = 'RUB',
        variant = 'active',
        title,
        subtitle,
        flightPopular,
        dynamicRide,
        ...rest
    } = props;
    const classes = useStyles(props);
    const { t } = useTranslation();
    const { isMobile, isCordova } = usePlatform();
    const { meta, isAtlas } = useSAAS();

    const isDisabled = variant === 'loading' || variant === 'no-seats';

    const surged =
        flightPopular === SearchDtoFlightPopularEnum.NUMBER_1 &&
        !meta.surgeDisabled &&
        (isMobile || isCordova);

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
                            {surged ? (
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
                                          currency: currencySymbol[currency],
                                      })}
                            </span>
                        </Box>
                        {freeSeats ? (
                            <Box
                                className={clsx({
                                    [classes.subtitle]: true,
                                    [classes.subtitleLoading]:
                                        variant === 'loading',
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
            className={clsx({
                [classes.buttonSurged]: surged,
                [classes.buttonDynamicRide]: dynamicRide && isAtlas,
                // проверка isAtlas нужна чтобы не переписать
                // цвет кнопки (theme.primary) градиентом у партнеров
            })}
            variant="contained"
            color="primary"
            disabled={isDisabled}
            {...rest}
        >
            {renderBody()}
        </Button>
    );
};
