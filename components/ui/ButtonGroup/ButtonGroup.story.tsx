import React, { useState } from 'react';
import { storiesOf } from '@storybook/react';

import { Button } from '../Button';
import { ButtonGroup } from './ButtonGroup';

storiesOf('ui/ButtonGroup', module)
    .add('size small', () => {
        const Component = () => {
            const days = ['Ночь', 'Утро', 'День', 'Вечер'];
            const [value, setValue] = useState('Ночь');

            const renderButton = (day: string) => (
                <Button
                    key={day}
                    variant={day === value ? 'contained' : 'outlined'}
                    onClick={() => setValue(day)}
                    height="100%"
                >
                    {day}
                </Button>
            );

            return (
                <ButtonGroup variant="outlined" color="primary" size="small">
                    {days.map(renderButton)}
                </ButtonGroup>
            );
        };

        return <Component />;
    })
    .add('size medium', () => (
        <ButtonGroup variant="outlined" color="primary" size="medium">
            <Button height="100%">Прямые</Button>
            <Button height="100%">1</Button>
            <Button height="100%">2+</Button>
        </ButtonGroup>
    ))
    .add('size large', () => (
        <ButtonGroup variant="outlined" color="primary" size="large">
            <Button height="100%">Прямые</Button>
            <Button height="100%">1</Button>
            <Button height="100%">2+</Button>
        </ButtonGroup>
    ));
