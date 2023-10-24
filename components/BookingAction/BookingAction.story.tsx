import React, { useState } from 'react';
import { storiesOf } from '@storybook/react';
import FormControlLabel from '@material-ui/core/FormControlLabel';

import { ActionBar } from '../ActionBar';
import { BookingAction } from './BookingAction';
import { Checkbox } from '../ui/Checkbox/Checkbox';
import { CountdownButton } from '../CountdownButton/CountdownButton';
import { Typo } from '../Typo/Typo';

storiesOf('BookingAction', module)
    .add('continue button', () => {
        const Component = () => {
            const [countdownDate] = useState(Date.now() + 90000);

            return (
                <ActionBar>
                    <BookingAction
                        price={500}
                        tickets={2}
                        currency="RUB"
                        button={
                            <CountdownButton date={countdownDate} fullWidth>
                                Продолжить
                            </CountdownButton>
                        }
                    />
                </ActionBar>
            );
        };

        return <Component />;
    })
    .add('pay button', () => {
        const Component = () => {
            const [countdownDate] = useState(Date.now() + 10000);

            const [checked, setChecked] = useState(false);
            const handleChange = (e: React.ChangeEvent<HTMLInputElement>) =>
                setChecked(e.target.checked);

            return (
                <ActionBar>
                    <FormControlLabel
                        control={
                            <Checkbox
                                checked={checked}
                                onChange={handleChange}
                                color="primary"
                            />
                        }
                        label={
                            <Typo color="textPrimary">
                                Я ознакомился и согласен с условиями.
                            </Typo>
                        }
                        style={{ marginBottom: 16 }}
                    />

                    <BookingAction
                        price={500}
                        tickets={2}
                        currency="RUB"
                        button={
                            <CountdownButton
                                date={countdownDate}
                                fullWidth
                                color="secondary"
                            >
                                Оплатить
                            </CountdownButton>
                        }
                    />
                </ActionBar>
            );
        };

        return <Component />;
    });
