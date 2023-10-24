import React from 'react';
import { storiesOf } from '@storybook/react';

import { DesktopBookingPaymentItem } from './DesktopBookingPaymentItem';
import { Props } from './DesktopBookingPaymentItem';
import { currencySymbol } from 'utils/currency';

storiesOf('DesktopBookingPaymentItem', module)
    .add('default', () => <DesktopBookingPaymentItem {...defaultProps} />)
    .add('selected', () => (
        <DesktopBookingPaymentItem {...defaultProps} selected />
    ))
    .add('disabled', () => (
        <DesktopBookingPaymentItem {...defaultProps} disabled />
    ));

const defaultProps: Props = {
    title: 'Банковская карта',
    subtitle: 'Visa, Mastercard, Maestro, Mir',
    price: 120,
    currency: currencySymbol.RUB,
    onClick: () => {},
};
