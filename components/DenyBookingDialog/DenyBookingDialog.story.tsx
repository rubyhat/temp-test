import React from 'react';
import { storiesOf } from '@storybook/react';

import { DenyBookingDialog } from './DenyBookingDialog';
import {
    BookingUnavailableBlacklistReasonDtoCodeEnum,
    BookingUnavailableNearRoutesReasonDtoCodeEnum,
    BookingUnavailableTicketsPerRouteReasonDtoCodeEnum,
} from 'swagger/client';

const inBlackList = {
    available: false,
    reason: {
        code: BookingUnavailableBlacklistReasonDtoCodeEnum.InBlackList,
    },
};

const forbiddenNearRoutes = {
    available: false,
    reason: {
        code: BookingUnavailableNearRoutesReasonDtoCodeEnum.ForbiddenNearRoutes,
        value: '2020-08-09T18:31:42',
    },
};

const ticketsPerRouteCount = {
    available: false,
    reason: {
        code:
            BookingUnavailableTicketsPerRouteReasonDtoCodeEnum.TicketsPerRouteCount,
        value: 20,
        limit: 10,
    },
};

storiesOf('DenyBookingDialog', module)
    .add('in_black_list', () => (
        <DenyBookingDialog availability={inBlackList} />
    ))
    .add('forbidden_near_routes', () => (
        <DenyBookingDialog availability={forbiddenNearRoutes} />
    ))
    .add('tickets_per_route_count', () => (
        <DenyBookingDialog availability={ticketsPerRouteCount} />
    ));
