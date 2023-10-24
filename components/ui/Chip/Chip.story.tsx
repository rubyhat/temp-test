import React from 'react';
import { storiesOf } from '@storybook/react';

import { Chip } from './Chip';

storiesOf('ui/Chip', module)
    .add('primary', () => <Chip label="10%" color="primary" size="small" />)
    .add('secondary', () => <Chip label="10%" color="secondary" size="small" />)
    .add('size medium', () => <Chip label="10%" color="primary" />);
