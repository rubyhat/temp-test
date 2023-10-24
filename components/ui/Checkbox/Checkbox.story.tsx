import React, { useState } from 'react';
import { storiesOf } from '@storybook/react';

import { Checkbox } from './Checkbox';

storiesOf('ui/Checkbox', module)
    .add('primary', () => {
        const Component = () => {
            const [check, setCheck] = useState(false);

            return (
                <Checkbox
                    color="primary"
                    checked={check}
                    onChange={e => setCheck(e.target.checked)}
                />
            );
        };

        return <Component />;
    })
    .add('secondary', () => {
        const Component = () => {
            const [check, setCheck] = useState(false);

            return (
                <Checkbox
                    color="secondary"
                    checked={check}
                    onChange={e => setCheck(e.target.checked)}
                />
            );
        };

        return <Component />;
    });
