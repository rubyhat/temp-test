import { useState } from 'react';

import {
    OrderDto,
    OrderDtoPaymentMethodEnum,
    OrderDtoStatusEnum,
    TicketDto,
    TicketDtoStatusEnum,
} from 'swagger/client';
import { currencySymbol, CurrencySymbol } from 'utils/currency';
import { checkRideCompleted } from 'utils/time';
import { useTranslation } from 'i18n';

export function useOrderTicket(
    order: OrderDto,
    ticket: TicketDto,
    currency: CurrencySymbol
) {
    const { t } = useTranslation();
    const [cancelDialogOpen, setCancelDialogOpen] = useState(false);

    const isRideCompleted = order.rideInfo
        ? checkRideCompleted(
              order.rideInfo.arrival as string,
              order.rideInfo.to.timezone
          )
        : false;
    const canCancelTicket =
        !isRideCompleted &&
        (ticket.status === TicketDtoStatusEnum.Booked ||
            ticket.status === TicketDtoStatusEnum.Active ||
            ticket.status === TicketDtoStatusEnum.Confirmed ||
            ticket.status === TicketDtoStatusEnum.Error);

    const canDownloadTicket =
        ticket.url &&
        (order.status === OrderDtoStatusEnum.Active ||
            order.status === OrderDtoStatusEnum.Confirmed ||
            order.status === OrderDtoStatusEnum.Landing ||
            order.status === OrderDtoStatusEnum.Booked);

    const canDownloadChecks =
        order.checks && order.checks.length > 0 && order.checks;

    const discountPrice = ticket.paid || ticket.price;
    const currencyPaid =
        order.paymentMethod === OrderDtoPaymentMethodEnum.Miles
            ? t('booking:miles', { count: discountPrice })
            : currencySymbol[currency];

    const handleDialogClose = () => {
        document.body.style.overflow = 'auto';
        setCancelDialogOpen(false);
    };
    const handleClickReturnTicket = () => {
        setCancelDialogOpen(true);
    };

    return {
        cancelDialogOpen,
        canCancelTicket,
        canDownloadTicket,
        canDownloadChecks,
        discountPrice,
        currencyPaid,
        handleDialogClose,
        handleClickReturnTicket,
    };
}
