import React from 'react';
import { storiesOf } from '@storybook/react';

import { DesktopOrderCard } from './DesktopOrderCard';
import { orderBooked } from '../OrderCard/OrderCard.story';

storiesOf('DesktopOrderCard', module).add('default', () => (
    <DesktopOrderCard order={orderBooked} />
));
