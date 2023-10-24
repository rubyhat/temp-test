import React from 'react';
import { storiesOf } from '@storybook/react';

import { FiltersBar } from './FiltersBar';

storiesOf('FiltersBar', module)
    .add('default', () => <FiltersBar />)
    .add('reset button', () => <FiltersBar showReset />);
