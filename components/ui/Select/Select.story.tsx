import React, { useState } from 'react';
import { storiesOf } from '@storybook/react';

import { Select } from './Select';

const items = [1, 2, 3, 4, 5].map(i => ({
    text: `${i} человек`,
    value: String(i),
}));

storiesOf('ui/Select', module)
    .add('naked', () => {
        const Component = () => {
            const [value, setValue] = useState('1');

            return (
                <Select
                    value={value}
                    onChange={e => setValue(e.target.value as string)}
                    items={items}
                    disableUnderline={true}
                    label="Пассажиры"
                />
            );
        };

        return <Component />;
    })
    .add('outlined + label', () => {
        const Component = () => {
            const [value, setValue] = useState('');

            return (
                <Select
                    value={value}
                    onChange={e => setValue(e.target.value as string)}
                    items={items}
                    variant="outlined"
                    label="Пассажиры"
                />
            );
        };

        return <Component />;
    })
    .add('underlined', () => {
        const Component = () => {
            const [value, setValue] = useState('');

            return (
                <Select
                    value={value}
                    onChange={e => setValue(e.target.value as string)}
                    items={items}
                    label="Пассажиры"
                />
            );
        };

        return <Component />;
    });
