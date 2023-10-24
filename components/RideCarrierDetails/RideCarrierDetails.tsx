import React, { FC } from 'react';
import clsx from 'clsx';
import { makeStyles } from '@material-ui/core/styles';

import {
    TwoLineList,
    TwoLineListItem,
    TwoLineListItemText,
} from 'components/ui/TwoLineList';
import { CurrencySymbol } from 'utils/currency';
import { DesktopTripCarrierPhones } from 'components/DesktopTripDetails/DesktopTripCarrierPhones';
import { SearchDto } from 'swagger/client';
import { Tooltip } from 'components/ui/Tooltip';
import { Typo } from 'components/Typo/Typo';
import { formatPhone, tel } from 'utils/phone';
import { useTranslation } from 'i18n';

const useStyles = makeStyles(
    theme => ({
        /* Styles applied to the root element. */
        root: {},
        DesktopTripCarrierPhones: {
            // @todo change name
            marginTop: theme.spacing(1),
        },
        /* Styles applied to the carrier phone `a` element. */
        carrierPhoneLink: {
            textDecoration: 'none',
        },
    }),
    { name: 'RideCarrierDetails' }
);

type RideCarrierDetailsProps = {
    ride: SearchDto;
    className?: string;
};

export const RideCarrierDetails: FC<RideCarrierDetailsProps> = props => {
    const { className, ride } = props;
    const classes = useStyles();
    const { t } = useTranslation();

    const { legal, freighter } = ride;
    const phones = ride.carrier_phones || [];
    const currency = ride.currency as CurrencySymbol;

    return (
        <TwoLineList className={clsx(classes.root, className)}>
            {legal && legal.name ? (
                <TwoLineListItem>
                    <TwoLineListItemText
                        primary={t('legalBrandName')}
                        secondary={legal.name}
                    />
                </TwoLineListItem>
            ) : null}

            {legal && legal.tin ? (
                <TwoLineListItem>
                    <TwoLineListItemText
                        primary={
                            currency === 'BYN' ? t('legalTinRB') : t('legalTin')
                        }
                        secondary={legal.tin}
                    />
                </TwoLineListItem>
            ) : null}

            {legal && legal.address ? (
                <TwoLineListItem>
                    <TwoLineListItemText
                        primary={t('legalAddress')}
                        secondary={legal.address}
                    />
                </TwoLineListItem>
            ) : null}

            {freighter && freighter.authority ? (
                <TwoLineListItem>
                    <TwoLineListItemText
                        primary={t('freighterAuthority')}
                        secondary={freighter.authority}
                    />
                </TwoLineListItem>
            ) : null}

            {freighter && freighter.regDate ? (
                <TwoLineListItem>
                    <TwoLineListItemText
                        primary={t('freighterRegDate')}
                        secondary={freighter.regDate}
                    />
                </TwoLineListItem>
            ) : null}

            {freighter && freighter.license ? (
                <TwoLineListItem>
                    <TwoLineListItemText
                        primary={t('freighterLicense')}
                        secondary={freighter.license}
                    />
                </TwoLineListItem>
            ) : null}

            {/* @todo придумать как отобразить весь список телефонов */}
            {phones.length ? (
                <TwoLineListItem>
                    <TwoLineListItemText
                        primary={t('partnerPhone')}
                        secondary={
                            <Tooltip
                                title={
                                    <div>
                                        <Typo weight="bold">{t('phones')}</Typo>

                                        <DesktopTripCarrierPhones
                                            className={
                                                classes.DesktopTripCarrierPhones
                                            }
                                            carrierPhones={phones}
                                        />
                                    </div>
                                }
                                variant="white"
                                interactive
                            >
                                <a
                                    className={classes.carrierPhoneLink}
                                    href={`tel:${tel(formatPhone(phones[0]))}`}
                                >
                                    {formatPhone(phones[0])}
                                </a>
                            </Tooltip>
                        }
                    />
                </TwoLineListItem>
            ) : null}
        </TwoLineList>
    );
};
