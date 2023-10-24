import React, { FC } from 'react';
import clsx from 'clsx';
import CheckIcon from '@material-ui/icons/Check';
import Divider from '@material-ui/core/Divider';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import ListItemText from '@material-ui/core/ListItemText';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import { makeStyles, Theme } from '@material-ui/core/styles';
import { useDispatch, useSelector } from 'react-redux';

import CashSVG from './assets/cash.svg';
import CreditCardSVG from './assets/credit-card.svg';
import MilesSVG from './assets/miles.svg';
import { List } from '../ui/List/List';
import { Typo } from '../Typo/Typo';
import { formatPrice } from 'utils/price';
import { useTranslation } from 'i18n';
import { currencySymbol, CurrencySymbol } from 'utils/currency';
import {
    CardDto,
    MilesAccrualDto,
    RideDtoPaymentTypesEnum,
} from 'swagger/client';
import { RootState } from 'store';
import { PaymentState } from 'store/payment/types';
import { paymentSaveCreditCard } from 'store/payment/actions';
import Link from 'next/link';
import { useSAAS } from 'hooks/useSAAS';
import { useCountry } from 'hooks/useCountry';
import { InvoiceState } from 'store/invoice/types';
import { SavedCardItem } from './SavedCardItem';
import { AtlasTheme } from 'typings/atlas-theme';

const useStyles = makeStyles(
    (theme: Theme & AtlasTheme) => ({
        /* Styles applied to the root element. */
        root: {
            backgroundColor: '#FFF',
        },
        /* Styles applied to the price `div` element. */
        price: {
            display: 'inline-flex',
            fontSize: theme.atlas.typography.body1.fontSize,
            fontWeight: 700,
            color: theme.atlas.palette.text.minor,
        },
        /* Styles applied to the price `div` element if selected. */
        priceSelected: {
            color: theme.atlas.palette.text.base,
        },
        /* Pseudo-class applied to the ListItem component if selected={true} */
        itemSelected: {
            '.MuiListItem-root&': {
                background:
                    'linear-gradient(0deg, rgba(0, 160, 102, 0.15), rgba(0, 160, 102, 0.15)), #FFFFFF',
                '&:hover': {
                    backgroundColor: 'unset',
                },
            },
        },
        /* Styles applied to the details `div` element. */
        details: {
            paddingRight: theme.spacing(2),
            paddingBottom: theme.spacing(2),
            paddingLeft: theme.spacing(6),
            background:
                'linear-gradient(0deg, rgba(0, 160, 102, 0.15), rgba(0, 160, 102, 0.15)), #FFFFFF',
            color: theme.atlas.palette.text.base,
            fontSize: theme.atlas.typography.caption.fontSize,
            '& p': {
                margin: 0,
            },
        },
        /* Pseudo-class applied to the details `div` element if value="bank" */
        detailsNoBackground: {
            background: 'unset',
        },
        /* Styles applied to the forbidden payment type text `div` element. */
        forbiddenPaymentType: {
            color: theme.atlas.palette.text.base,
            marginRight: theme.spacing(2),
            '&>a': {
                color: theme.atlas.palette.text.base,
            },
            pointerEvents: 'auto',
        },
        titleWrap: {
            display: 'flex',
            alignItems: 'center',
        },
        priceValue: {
            marginLeft: 'auto',
        },
        paymentCardWrap: {
            margin: '0 16px 16px 16px',
            borderRadius: theme.spacing(1),
            overflow: 'hidden',
            '&:last-child': {
                marginBottom: 0,
            },
        },
        paymentIcon: {
            alignSelf: 'flex-start',
            marginRight: theme.spacing(1),
            fill: '#68787D',
        },
        activePaymentIcon: {
            fill: '#00A066',
        },
        cardHeader: {
            width: '100%',
            display: 'flex',
        },
        cardHeaderSubtitle: {
            fontSize: theme.spacing(1.5),
            color: '#68787D',
        },
        cardHeaderTitleWrap: {
            width: '100%',
        },
    }),
    { name: 'BookingPaymentSelect' }
);

export type PaymentType = 'bank' | 'cash' | 'miles' | number;

export type Props = {
    value: PaymentType | '';
    onChange: (value: PaymentType) => void;
    prices: Record<PaymentType, number>;
    milesBalance?: number;
    disabled?: Record<PaymentType, boolean>;
    forbidden?: Record<PaymentType, boolean>;
    paymentTypes: RideDtoPaymentTypesEnum[];
    bonus?: Record<Exclude<PaymentType, 'miles'>, number>;
    currency: CurrencySymbol;
    className?: string;
    cards?: CardDto[];
    disablePadding?: boolean; // forwarded to List component
    milesAward?: any;
    accruedMiles: MilesAccrualDto;
};

export const BookingPaymentSelect: FC<Props> = props => {
    const {
        value,
        onChange,
        className,
        prices,
        milesBalance = 0,
        currency,
        disabled = {
            bank: false,
            cash: false,
            miles: false,
        },
        forbidden = {
            bank: false,
            cash: false,
            miles: false,
        },
        paymentTypes,
        bonus = {
            bank: 0,
            cash: 0,
            miles: 0,
        },
        cards = [],
        disablePadding,
        milesAward,
        accruedMiles,
    } = props;

    const classes = useStyles();
    const { t } = useTranslation();
    const { country } = useCountry();
    const dispatch = useDispatch();
    const { meta, isMioTaxi } = useSAAS();

    const { saveCreditCard } = useSelector<RootState, PaymentState>(
        rootState => rootState.payment
    );
    const handleSaveCreditCard = (e: React.ChangeEvent<HTMLInputElement>) =>
        dispatch(paymentSaveCreditCard(e.target.checked));

    const { invoice } = useSelector<RootState, InvoiceState>(
        rootState => rootState.invoice
    );
    const acquiringSupportsSavingCreditCards =
        invoice &&
        invoice.confirmationUrl &&
        invoice.confirmationUrl.confirmAndSave;

    const handleChange = (value: PaymentType) => () => {
        if (!disabled[value] && !forbidden[value]) {
            onChange(value);
        }
    };

    const handleBankChange = () => {
        if (cards.length > 0) {
            handleChange(cards[0].id)();
        } else {
            handleChange('bank')();
        }
    };

    const listItemClasses = {
        selected: classes.itemSelected,
    };

    const cardPaymentAvailable = paymentTypes.includes(
        RideDtoPaymentTypesEnum.Card
    );
    const reccurPaymentAvailable = paymentTypes.includes(
        RideDtoPaymentTypesEnum.Reccur
    );
    const cashPaymentAvailable = paymentTypes.includes(
        RideDtoPaymentTypesEnum.Cash
    );
    const milesPaymentAvailable = paymentTypes.includes(
        RideDtoPaymentTypesEnum.Miles
    );

    const isBankOrReccur = value === 'bank' || typeof value === 'number';
    const displaySavedCards = reccurPaymentAvailable && isBankOrReccur;
    const hasSavedCards = !!cards.length;
    const milesDisabledSaaS = meta.milesDisabled;

    const renderCreditCards = () =>
        cards.map(card => (
            <React.Fragment key={card.id}>
                <ListItem
                    classes={listItemClasses}
                    button
                    disableRipple
                    onClick={handleChange(card.id)}
                    selected={value === card.id}
                >
                    <ListItemIcon>
                        {value === card.id ? (
                            <CheckIcon color="secondary" />
                        ) : (
                            <CreditCardSVG />
                        )}
                    </ListItemIcon>

                    <SavedCardItem card={card} />

                    <ListItemSecondaryAction>
                        <div
                            className={clsx({
                                [classes.price]: true,
                                [classes.priceSelected]: value === card.id,
                            })}
                        >
                            {formatPrice(
                                prices['bank'],
                                currencySymbol[currency]
                            )}
                        </div>
                    </ListItemSecondaryAction>
                </ListItem>
            </React.Fragment>
        ));

    const renderNewCreditCard = () => (
        <ListItem
            classes={listItemClasses}
            button
            disableRipple
            onClick={handleChange('bank')}
            selected={value === 'bank'}
        >
            <ListItemIcon>
                {value === 'bank' ? (
                    <CheckIcon color="secondary" />
                ) : (
                    <CreditCardSVG />
                )}
            </ListItemIcon>

            <ListItemText primary={t('booking:newCreditCard')} />

            <ListItemSecondaryAction>
                <div
                    className={clsx({
                        [classes.price]: true,
                        [classes.priceSelected]: value === 'bank',
                    })}
                >
                    {formatPrice(prices['bank'], currencySymbol[currency])}
                </div>
            </ListItemSecondaryAction>
        </ListItem>
    );
    const forbiddenNode = (
        <div className={classes.forbiddenPaymentType}>
            {t('booking:forbiddenPaymentTypeDesc')}{' '}
            <Link href="/profile/rating">
                {t('booking:forbiddenPaymentTypeDetails')}
            </Link>
        </div>
    );

    return (
        <div className={clsx(classes.root, className)}>
            <List>
                <div className={classes.paymentCardWrap}>
                    {cardPaymentAvailable ? (
                        <ListItem
                            classes={listItemClasses}
                            button
                            disableRipple
                            onClick={handleBankChange}
                            disabled={disabled.bank || forbidden.bank}
                            selected={value === 'bank' && !hasSavedCards}
                        >
                            <div className={classes.cardHeader}>
                                <CreditCardSVG
                                    className={
                                        value === 'bank' && !hasSavedCards
                                            ? clsx(
                                                  classes.paymentIcon,
                                                  classes.activePaymentIcon
                                              )
                                            : classes.paymentIcon
                                    }
                                />
                                <div className={classes.cardHeaderTitleWrap}>
                                    <Typo className={classes.titleWrap}>
                                        {t('booking:paymentTypeCard')}

                                        <strong
                                            className={clsx(
                                                {
                                                    [classes.price]: true,
                                                    [classes.priceSelected]:
                                                        value === 'bank',
                                                },
                                                classes.priceValue
                                            )}
                                        >
                                            {formatPrice(
                                                prices['bank'],
                                                currencySymbol[currency]
                                            )}
                                        </strong>
                                    </Typo>
                                    <Typo
                                        className={classes.cardHeaderSubtitle}
                                    >
                                        {forbidden.bank
                                            ? forbiddenNode
                                            : t('booking:paymentTypeCardDesc')}
                                    </Typo>
                                </div>
                            </div>
                        </ListItem>
                    ) : null}
                    {displaySavedCards ? renderCreditCards() : null}
                    {isBankOrReccur && hasSavedCards
                        ? renderNewCreditCard()
                        : null}
                    {isBankOrReccur ? (
                        <div
                            className={clsx(classes.details, {
                                [classes.detailsNoBackground]:
                                    reccurPaymentAvailable && !!cards.length,
                            })}
                        >
                            {t('booking:paymentTypeCardDetails', {
                                context: country,
                            })
                                .split('\n')
                                .map((text, index) => (
                                    <p key={index}>{text}</p>
                                ))}
                            <p>
                                {Boolean(accruedMiles.card)
                                    ? t('booking:milesBonus', {
                                          count: accruedMiles.card,
                                      })
                                    : t('booking:milesBonusEmpty')}
                            </p>
                            {value === 'bank' &&
                            acquiringSupportsSavingCreditCards ? (
                                <FormControlLabel
                                    control={
                                        <Checkbox
                                            checked={saveCreditCard}
                                            onChange={handleSaveCreditCard}
                                            color="secondary"
                                        />
                                    }
                                    label={
                                        <Typo color="textPrimary">
                                            {t('booking:saveCreditCard')}
                                        </Typo>
                                    }
                                />
                            ) : null}
                        </div>
                    ) : null}
                </div>
                <div className={classes.paymentCardWrap}>
                    {cashPaymentAvailable ? (
                        <ListItem
                            classes={listItemClasses}
                            button
                            disableRipple
                            onClick={handleChange('cash')}
                            disabled={disabled.cash || forbidden.cash}
                            selected={value === 'cash'}
                        >
                            <div className={classes.cardHeader}>
                                <CashSVG
                                    className={
                                        value === 'cash'
                                            ? clsx(
                                                  classes.paymentIcon,
                                                  classes.activePaymentIcon
                                              )
                                            : classes.paymentIcon
                                    }
                                />
                                <div className={classes.cardHeaderTitleWrap}>
                                    <Typo className={classes.titleWrap}>
                                        {t('booking:paymentTypeCash')}
                                        <strong
                                            className={clsx(
                                                {
                                                    [classes.price]: true,
                                                    [classes.priceSelected]:
                                                        value === 'cash',
                                                },
                                                classes.priceValue
                                            )}
                                        >
                                            {formatPrice(
                                                prices['cash'],
                                                currencySymbol[currency]
                                            )}
                                        </strong>
                                    </Typo>
                                    <Typo
                                        className={classes.cardHeaderSubtitle}
                                    >
                                        {forbidden.cash
                                            ? forbiddenNode
                                            : t('booking:paymentTypeCashDesc')}
                                    </Typo>
                                </div>
                            </div>
                        </ListItem>
                    ) : null}

                    {value === 'cash' ? (
                        <div className={classes.details}>
                            {t(
                                isMioTaxi
                                    ? 'booking:paymentTypeCashDetailsTaxi'
                                    : 'booking:paymentTypeCashDetails',
                                {
                                    context: country,
                                }
                            )
                                .split('\n')
                                .map((text, index) => (
                                    <p key={index}>{text}</p>
                                ))}
                            {milesAward === 0 ? (
                                ''
                            ) : (
                                <p>
                                    {Boolean(accruedMiles.cash)
                                        ? t('booking:milesBonus', {
                                              count: accruedMiles.cash,
                                          })
                                        : t('booking:milesBonusEmpty')}
                                </p>
                            )}
                        </div>
                    ) : null}
                </div>
                <div className={classes.paymentCardWrap}>
                    {milesPaymentAvailable && !milesDisabledSaaS ? (
                        <ListItem
                            classes={listItemClasses}
                            button
                            disableRipple
                            onClick={handleChange('miles')}
                            disabled={disabled.miles || forbidden.miles}
                            selected={value === 'miles'}
                        >
                            <div className={classes.cardHeader}>
                                <MilesSVG
                                    className={
                                        value === 'miles'
                                            ? clsx(
                                                  classes.paymentIcon,
                                                  classes.activePaymentIcon
                                              )
                                            : classes.paymentIcon
                                    }
                                />
                                <div className={classes.cardHeaderTitleWrap}>
                                    <Typo className={classes.titleWrap}>
                                        {t('booking:paymentTypeMiles')}
                                        <strong
                                            className={clsx(
                                                {
                                                    [classes.price]: true,
                                                    [classes.priceSelected]:
                                                        value === 'miles',
                                                },
                                                classes.priceValue
                                            )}
                                        >
                                            {prices['miles']}{' '}
                                            {t('booking:miles', {
                                                count: prices['miles'],
                                            })}
                                        </strong>
                                    </Typo>
                                    <Typo
                                        className={classes.cardHeaderSubtitle}
                                    >
                                        {forbidden.miles
                                            ? forbiddenNode
                                            : milesBalance > 0
                                            ? t(
                                                  'booking:paymentTypeMilesAvailableBalance',
                                                  { count: milesBalance }
                                              )
                                            : t(
                                                  'booking:paymentTypeMilesZeroBalance'
                                              )}
                                    </Typo>
                                </div>
                            </div>
                        </ListItem>
                    ) : null}
                </div>
            </List>
        </div>
    );
};
