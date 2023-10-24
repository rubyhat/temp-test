import { BusColorDto, BusDto, DestinationDto, StopsDto } from 'swagger/client';

const ONLINE_PAY = ['card', 'reccur'];

export function formatBusName(bus: BusDto): string {
    let busName = '';

    if (bus.mark) busName += bus.mark;
    if (bus.model) busName += ', ' + bus.model;

    return busName;
}

export function formatBusColor(busColor: BusColorDto): string {
    return busColor.name || '';
}

export function formatRideName(
    from: DestinationDto,
    to: DestinationDto
): string {
    return `${from.desc} – ${to.desc}`;
}

export function sortStopsByDatetime(stops: StopsDto[]): StopsDto[] {
    const clonedStops = [...stops];

    return clonedStops.sort((left, right) => {
        if (left.datetime < right.datetime) {
            return -1;
        } else if (left.datetime > right.datetime) {
            return 1;
        }

        return 0;
    });
}

export function rideMinPrice(
    price: number,
    onlinePrice?: number,
    payments: string[] = []
) {
    const prices = [price];
    const isOnlinePayAvailable = Boolean(
        ONLINE_PAY.filter(x => payments.includes(x)).length
    );

    if (onlinePrice && isOnlinePayAvailable) {
        prices.push(onlinePrice);
    }

    return Math.min.apply(null, prices);
}
