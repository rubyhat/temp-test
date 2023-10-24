import React, { useState } from 'react';
import { storiesOf } from '@storybook/react';

import { DesktopBookingPaymentSelect } from './DesktopBookingPaymentSelect';
import { PaymentType } from '../BookingPaymentSelect';
import {
    forbidden,
    paymentTypes,
    prices,
} from '../BookingPaymentSelect/BookingPaymentSelect.story';

storiesOf('DesktopBookingPaymentSelect', module)
    .add('default', () => {
        const [value, setValue] = useState<PaymentType>('bank');
        const handleChange = (value: PaymentType) => setValue(value);

        const Component = () => {
            return (
                <DesktopBookingPaymentSelect
                    value={value}
                    onChange={handleChange}
                    prices={prices}
                    currency="RUB"
                    paymentTypes={paymentTypes}
                    accruedMiles={{
                        card: 0,
                        cash: 0,
                    }}
                />
            );
        };

        return <Component />;
    })
    .add('forbidden payment type', () => {
        const [value, setValue] = useState<PaymentType>('bank');
        const handleChange = (value: PaymentType) => setValue(value);

        const Component = () => {
            return (
                <DesktopBookingPaymentSelect
                    value={value}
                    onChange={handleChange}
                    prices={prices}
                    currency="RUB"
                    paymentTypes={paymentTypes}
                    forbidden={forbidden}
                    accruedMiles={{
                        card: 0,
                        cash: 0,
                    }}
                />
            );
        };

        return <Component />;
    });
