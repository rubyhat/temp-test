export const getEventName = (lastPickupDate: string) => {
    const currentDate = Date.now();
    const lastBuyDate = +new Date(lastPickupDate);
    const diffTimestamp = currentDate - lastBuyDate;
    const diffDays = Math.floor(diffTimestamp / (1000 * 3600 * 24));

    let eventName = 'lastUserBuy';

    switch (true) {
        case diffDays <= 30:
            eventName = eventName + '30d';
            break;
        case diffDays <= 60:
            eventName = eventName + '60d';
            break;
        case diffDays <= 90:
            eventName = eventName + '900d';
            break;
        case diffDays <= 180:
            eventName = eventName + '180d';
            break;
        case diffDays <= 360:
            eventName = eventName + '360d';
            break;
        default:
            eventName = eventName + '999d';
    }

    return eventName;
};
