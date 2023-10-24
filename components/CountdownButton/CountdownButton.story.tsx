import React, { useState } from 'react';
import { storiesOf } from '@storybook/react';

import { CountdownButton } from './CountdownButton';

storiesOf('CountdownButton', module)
    .addDecorator(fn => <div style={{ width: 328 }}>{fn()}</div>)
    .add('primary', () => {
        const Component = () => {
            const [countdownDate] = useState(Date.now() + 90000);

            return (
                <CountdownButton date={countdownDate} fullWidth>
                    Продолжить
                </CountdownButton>
            );
        };

        return <Component />;
    })
    .add('secondary', () => {
        const Component = () => {
            const [countdownDate] = useState(Date.now() + 20000);

            return (
                <CountdownButton
                    date={countdownDate}
                    color="secondary"
                    fullWidth
                >
                    Оплатить
                </CountdownButton>
            );
        };

        return <Component />;
    });
