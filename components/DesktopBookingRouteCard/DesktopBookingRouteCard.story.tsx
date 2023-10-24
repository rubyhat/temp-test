import React from 'react';
import { storiesOf } from '@storybook/react';

import { DesktopBookingRouteCard } from './DesktopBookingRouteCard';
import { DesktopRoute } from '../DesktopRoute';
import { routeProps } from '../DesktopRoute/DesktopRoute.story';

storiesOf('DesktopBookingRouteCard', module).add('default', () => (
    <DesktopBookingRouteCard
        departureDate={routeProps.departureDate}
        departureTimezone={routeProps.departureTimezone}
        arrivalDate={routeProps.arrivalDate}
        arrivalTimezone={routeProps.arrivalTimezone}
        passengers={1}
        route={<DesktopRoute {...routeProps} />}
    />
));
