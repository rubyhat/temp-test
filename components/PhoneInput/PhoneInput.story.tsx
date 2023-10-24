import React, { useState } from 'react';
import { storiesOf } from '@storybook/react';

import { PhoneInput } from './PhoneInput';

storiesOf('PhoneInput', module)
    .add('default', () => {
        const Component = () => {
            const [value, setValue] = useState('');
            const handleChange = (phone: string) => setValue(phone);

            return (
                <PhoneInput
                    label="Phone Mask"
                    value={value}
                    onPhoneChange={handleChange}
                />
            );
        };

        return <Component />;
    })
    .add('desktop', () => {
        const Component = () => {
            const [value, setValue] = useState('');
            const handleChange = (phone: string) => setValue(phone);

            return (
                <PhoneInput
                    label="Phone Mask"
                    value={value}
                    onPhoneChange={handleChange}
                    variant="outlined"
                />
            );
        };

        return <Component />;
    });
