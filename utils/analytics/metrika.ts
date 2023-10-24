import { SaaSConfigDto } from 'swagger/client';

export const metrikaID = Number(process.env.YANDEX_METRIKA_ID);
export const metrikaOptions = {
    clickmap: true,
    trackLinks: true,
    accurateTrackBounce: true,
    webvisor: true,
};

export function getMetrikaAccounts(partners: SaaSConfigDto[]) {
    return partners
        .map(partner => partner.meta.yandexMetrikaId)
        .filter(id => !!id);
}
