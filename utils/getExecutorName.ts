import { RideDto, SearchDto } from 'swagger/client';

export function getExecutorName(ride: SearchDto | RideDto): string {
    const { legal, freighter, carrier: carrierName } = ride;

    const legalName = legal && legal.name;
    const freighterName = freighter && freighter.name;

    return legalName || freighterName || carrierName;
}
