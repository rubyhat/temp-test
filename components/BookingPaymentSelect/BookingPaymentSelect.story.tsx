import React, { useState } from 'react';
import { storiesOf } from '@storybook/react';

import { BookingPaymentSelect, PaymentType } from './BookingPaymentSelect';
import { RideDtoPaymentTypesEnum } from 'swagger/client';

storiesOf('BookingPaymentSelect', module)
    .add('default', () => {
        const Component = () => {
            const [value, setValue] = useState<PaymentType>('bank');
            const handleChange = (value: PaymentType) => setValue(value);

            return (
                <BookingPaymentSelect
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
    .add('not enough miles', () => {
        const Component = () => {
            const [value, setValue] = useState<PaymentType>('bank');
            const handleChange = (value: PaymentType) => setValue(value);

            return (
                <BookingPaymentSelect
                    value={value}
                    onChange={handleChange}
                    prices={{ ...prices, miles: 0 }}
                    currency="RUB"
                    disabled={disabled}
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
        const Component = () => {
            const [value, setValue] = useState<PaymentType>('bank');
            const handleChange = (value: PaymentType) => setValue(value);

            return (
                <BookingPaymentSelect
                    value={value}
                    onChange={handleChange}
                    prices={{ ...prices, miles: 0 }}
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

export const paymentTypes = [
    RideDtoPaymentTypesEnum.Card,
    RideDtoPaymentTypesEnum.Cash,
    RideDtoPaymentTypesEnum.Miles,
];

export const prices = {
    cash: 120,
    bank: 130,
    miles: 1200,
};

export const disabled = {
    cash: false,
    bank: false,
    miles: true,
};

export const forbidden = {
    cash: true,
    bank: false,
    miles: false,
};
