import { Suggestion } from 'store/search-form/types';
import { CompleteCity } from 'swagger/client';

type InfoPortalRouteType = {
    from: {
        id: string;
        name: string;
    };
    to: {
        id: string;
        name: string;
    };
};

type InfoPortalRoutesType = InfoPortalRouteType[];

const infoPortalRoutes: InfoPortalRoutesType = [
    {
        from: { id: 'c625144', name: 'Минск' },
        to: { id: 'c625625', name: 'Молодечно' },
    },
    {
        from: { id: 'c625144', name: 'Минск' },
        to: { id: 'c624785', name: 'Новогрудок' },
    },
    {
        from: { id: 'c627904', name: 'Гродно' },
        to: { id: 'c621048', name: 'Свислочь' },
    },
    {
        from: { id: 'c627904', name: 'Гродно' },
        to: { id: 'c628658', name: 'Дятлово' },
    },
    {
        from: { id: 'c629634', name: 'Брест' },
        to: { id: 'c627904', name: 'Гродно' },
    },
    {
        from: { id: 'c627904', name: 'Гродно' },
        to: { id: 'c629634', name: 'Брест' },
    },
    {
        from: { id: 'c625144', name: 'Минск' },
        to: { id: 'c625972', name: 'Логойск' },
    },
    {
        from: { id: 'c625972', name: 'Логойск' },
        to: { id: 'c625144', name: 'Минск' },
    },
    {
        from: { id: 'c630429', name: 'Барановичи' },
        to: { id: 'c627904', name: 'Гродно' },
    },
    {
        from: { id: 'c627904', name: 'Гродно' },
        to: { id: 'c630429', name: 'Барановичи' },
    },
    {
        from: { id: 'c627904', name: 'Гродно' },
        to: { id: 'c625367', name: 'Мосты' },
    },
    {
        from: { id: 'c625367', name: 'Мосты' },
        to: { id: 'c627904', name: 'Гродно' },
    },
    {
        from: { id: 'c621713', name: 'Сморгонь' },
        to: { id: 'c627904', name: 'Гродно' },
    },
    {
        from: { id: 'c627904', name: 'Гродно' },
        to: { id: 'c621713', name: 'Сморгонь' },
    },
    {
        from: { id: 'c625144', name: 'Минск' },
        to: { id: 'c630515', name: 'Ошмяны' },
    },
    {
        from: { id: 'c630515', name: 'Ошмяны' },
        to: { id: 'c625144', name: 'Минск' },
    },
    {
        from: { id: 'c535121', name: 'Липецк' },
        to: { id: 'c472045', name: 'Воронеж' },
    },
    {
        from: { id: 'c472045', name: 'Воронеж' },
        to: { id: 'c535121', name: 'Липецк' },
    },
    {
        from: { id: 'c472045', name: 'Воронеж' },
        to: { id: 'c484646', name: 'Тамбов' },
    },
    {
        from: { id: 'c484646', name: 'Тамбов' },
        to: { id: 'c472045', name: 'Воронеж' },
    },
    {
        from: { id: 'c491422', name: 'Сочи' },
        to: { id: 'c694423', name: 'Севастополь' },
    },
    {
        from: { id: 'c694423', name: 'Севастополь' },
        to: { id: 'c491422', name: 'Сочи' },
    },
];

export const checkIsInfoPortal = (
    from: Suggestion | CompleteCity | null,
    to: Suggestion | CompleteCity | null
): boolean => {
    if (from && from.id && to && to.id) {
        return infoPortalRoutes.some(
            route =>
                route.from.id.includes(String(from.id)) &&
                route.to.id.includes(String(to.id))
        );
    } else {
        return false;
    }
};
