import React, { FC } from 'react';
import clsx from 'clsx';
import { makeStyles } from '@material-ui/core/styles';

import { CurrencySymbol } from 'utils/currency';
import { DesktopTripCarrierPhones } from './DesktopTripCarrierPhones';
import { SearchDto } from 'swagger/client';
import { Tooltip } from 'components/ui/Tooltip';
import { Typo } from 'components/Typo/Typo';
import { formatPhone, tel } from 'utils/phone';
import { useTranslation } from 'i18n';

const useStyles = makeStyles(
    theme => ({
        /* Styles applied to the root element. */
        root: {},
        item: {
            display: 'flex',

            '& ~ &': {
                marginTop: theme.spacing(1),
            },
        },
        attribute: {
            minWidth: '50%',
        },
        text: {},
        DesktopTripCarrierPhones: {
            marginTop: theme.spacing(1),
        },
    }),
    { name: 'DesktopTripCarrierDetails' }
);

type DesktopTripCarrierDetailsProps = {
    ride: SearchDto;
    className?: string;
};

export const DesktopTripCarrierDetails: FC<
    DesktopTripCarrierDetailsProps
> = props => {
    const { className, ride } = props;
    const { legal, freighter } = ride;
    const classes = useStyles();
    const { t } = useTranslation();

    const phones = ride.carrier_phones || [];
    const currency = ride.currency as CurrencySymbol;

    return (
        <div className={clsx(classes.root, className)}>
            {legal && legal.name ? (
                <div className={classes.item}>
                    <Typo
                        className={classes.attribute}
                        variant="body5"
                        weight="medium"
                        color="textSecondary"
                    >
                        {t('legalBrandName')}
                    </Typo>

                    <Typo className={classes.text} variant="body5">
                        {legal.name}
                    </Typo>
                </div>
            ) : null}

            {legal && legal.tin ? (
                <div className={classes.item}>
                    <Typo
                        className={classes.attribute}
                        variant="body5"
                        weight="medium"
                        color="textSecondary"
                    >
                        {currency === 'BYN' ? t('legalTinRB') : t('legalTin')}
                    </Typo>

                    <Typo className={classes.text} variant="body5">
                        {legal.tin}
                    </Typo>
                </div>
            ) : null}

            {freighter && freighter.authority ? (
                <div className={classes.item}>
                    <Typo
                        className={classes.attribute}
                        variant="body5"
                        weight="medium"
                        color="textSecondary"
                    >
                        {t('freighterAuthority')}
                    </Typo>

                    <Typo className={classes.text} variant="body5">
                        {freighter.authority}
                    </Typo>
                </div>
            ) : null}

            {freighter && freighter.regDate ? (
                <div className={classes.item}>
                    <Typo
                        className={classes.attribute}
                        variant="body5"
                        weight="medium"
                        color="textSecondary"
                    >
                        {t('freighterRegDate')}
                    </Typo>

                    <Typo className={classes.text} variant="body5">
                        {freighter.regDate}
                    </Typo>
                </div>
            ) : null}

            {freighter && freighter.license ? (
                <div className={classes.item}>
                    <Typo
                        className={classes.attribute}
                        variant="body5"
                        weight="medium"
                        color="textSecondary"
                    >
                        {t('freighterLicense')}
                    </Typo>

                    <Typo className={classes.text} variant="body5">
                        {freighter.license}
                    </Typo>
                </div>
            ) : null}

            {legal && legal.address ? (
                <div className={classes.item}>
                    <Typo
                        className={classes.attribute}
                        variant="body5"
                        weight="medium"
                        color="textSecondary"
                    >
                        {t('legalAddress')}
                    </Typo>

                    <Typo className={classes.text} variant="body5">
                        {legal.address}
                    </Typo>
                </div>
            ) : null}

            {/*{legal && legal.phone ? (*/}
            {/*    <div className={classes.item}>*/}
            {/*        <Typo*/}
            {/*            className={classes.attribute}*/}
            {/*            variant="body5"*/}
            {/*            weight="medium"*/}
            {/*            color="textSecondary"*/}
            {/*        >*/}
            {/*            {t('legalPhone')}*/}
            {/*        </Typo>*/}

            {/*        <Typo className={classes.text} variant="body5">*/}
            {/*            <a href={`tel:${tel(formatPhone(legal.phone))}`}>*/}
            {/*                {formatPhone(legal.phone)}*/}
            {/*            </a>*/}
            {/*        </Typo>*/}
            {/*    </div>*/}
            {/*) : null}*/}

            {phones.length ? (
                <div className={classes.item}>
                    <Typo
                        className={classes.attribute}
                        variant="body5"
                        weight="medium"
                        color="textSecondary"
                    >
                        {t('partnerPhone')}
                    </Typo>

                    <Tooltip
                        title={
                            <div>
                                <Typo weight="bold">{t('phones')}</Typo>

                                <DesktopTripCarrierPhones
                                    className={classes.DesktopTripCarrierPhones}
                                    carrierPhones={phones}
                                />
                            </div>
                        }
                        variant="white"
                        interactive
                    >
                        <Typo variant="body5">
                            <a href={`tel:${tel(formatPhone(phones[0]))}`}>
                                {formatPhone(phones[0])}
                            </a>
                        </Typo>
                    </Tooltip>
                </div>
            ) : null}
        </div>
    );
};
