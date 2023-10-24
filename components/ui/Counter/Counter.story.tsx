import React, { useState } from 'react';
import { storiesOf } from '@storybook/react';

import { Counter } from './Counter';

storiesOf('ui/Counter', module)
    .add('default', () => {
        const Component = () => {
            const [count, setCount] = useState(0);

            return <Counter value={count} onChange={setCount} />;
        };

        return <Component />;
    });
