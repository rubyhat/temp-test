import React from 'react';
import { storiesOf } from '@storybook/react';

import { DesktopFilters } from './DesktopFilters';

storiesOf('DesktopFilters', module)
    .add('default', () => <DesktopFilters count={0} />)
    .add('filters count', () => <DesktopFilters count={1} />);
