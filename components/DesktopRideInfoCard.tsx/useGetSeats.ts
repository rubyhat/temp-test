import { OrderDto, TicketDto } from 'swagger/client';

export const useGetSeats = (order: OrderDto) => {
    const currentSeats: number[] = [];
    if (order.tickets) {
        order.tickets.forEach((ticket: TicketDto) => {
            if (ticket.passenger.seat) currentSeats.push(ticket.passenger.seat);
        });
    }
    return currentSeats;
};
