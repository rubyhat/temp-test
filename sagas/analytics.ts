import { SagaIterator } from 'redux-saga';
import TagManager from 'react-gtm-module';
import camelCase from 'lodash/camelCase';
import upperFirst from 'lodash/upperFirst';
import {
    all,
    call,
    delay,
    race,
    select,
    take,
    takeEvery,
    takeLatest,
} from 'redux-saga/effects';

import { FETCHING_RIDES_BROWSER } from 'store/search-rides/types';
import { RootState } from 'store';
import { RIDE_SUCCESS } from 'store/ride/types';
import { BOOKING_ORDER_SUCCESS } from 'store/booking/types';
import { OrderDto } from 'swagger/client';
import {
    USER_FETCHING_ERROR,
    USER_SUCCESS,
    UserSuccessAction,
} from 'store/user/types';
import {
    ORDER_STATUS_CHANGED_TO_SUCCESS,
    OrderStatusChangedToSuccessAction,
} from 'store/order/types';
import {
    USER_REFERRAL_COPY_PROMOCODE,
    USER_REFERRAL_SHARE_PROMOCODE,
    UserReferralCopyPromocode,
    UserReferralSharePromocode,
} from 'store/user-referral';
import {
    USER_REFERRAL_CLOSE_DIALOG,
    USER_REFERRAL_DIALOG_COPY_PROMOCODE,
    USER_REFERRAL_DIALOG_SHARE_PROMOCODE,
    USER_REFERRAL_DISMISS_DIALOG,
    UserReferralDialogCopyPromocode,
    UserReferralDialogSharePromocode,
} from 'store/user-referral-dialog';
import {
    LOYALTY_ERROR,
    LOYALTY_FETCHING,
    LOYALTY_SUCCESS,
    LoyaltyFetchingAction,
} from 'store/loyalty/types';
import { LOGIN_SUCCESS } from 'store/auth/types';
import { getEventName } from 'utils/analytics/getEventName';
import {
    HOTEL_BANNER_CLICKED,
    FILTER_CLICKED,
    STOPS_CLICKED,
} from 'store/affiliates/types';
import apiClient from 'lib/apiClient';
import { getEventParams } from './util/getEventParams';
import { isCordova } from 'utils/platform';
export interface IDataLayer {
    event: string;
}

export function* sendAnalytics(dataLayer: IDataLayer, useAppMetrica = true) {
    // Для мобильного приложения.
    if (
        useAppMetrica &&
        window &&
        window.appMetrica &&
        window.appMetrica.reportEvent
    ) {
        window.appMetrica.reportEvent(dataLayer.event, dataLayer);
    }

    // Отправляем аналитику с фронта на бекенд (а с бекенда она дальше пойдёт в гугл-аналитику)
    const isCompass = window && window.location.hostname.includes('compasbus');
    const isAtlas = window.location.hostname.includes('atlasbus');
    if (!isCordova && (isCompass || isAtlas)) {
        const state: RootState = ((yield select()) as unknown) as RootState;
        const params = state ? getEventParams(dataLayer.event, state) : {};
        const site = isAtlas ? 'atlas' : isCompass ? 'compass' : '';
        yield call(apiClient.sendAnalyticsToBackend, {
            event: dataLayer.event,
            site,
            ...params,
            ...(dataLayer.event.includes('Referral') ? dataLayer : {}),
        });
    }
    // Отправляем аналитику с фронта в гугл-аналитику
    yield call([TagManager, 'dataLayer'], { dataLayer });
}

function* search() {
    const state: RootState = ((yield select()) as unknown) as RootState;
    const dataLayer = {
        ...state.searchForm,
        event: 'Search',
    };
    yield call(sendAnalytics, dataLayer);
}

function* authUnauthorizedLogging() {
    const dataLayer = {
        event: 'authorization',
        authorized: false,
    };
    yield call(sendAnalytics, dataLayer, false);
}

function cleanOrder(order: OrderDto | null): any {
    if (!order) {
        return null;
    }
    return {
        ...order,
        tickets: (order.tickets || []).map(t => ({
            ...t,
            passenger: undefined,
            url: undefined,
        })),
    };
}

function* rideInfo() {
    const state: RootState = ((yield select()) as unknown) as RootState;
    const {
        ride: { rideInfo },
    } = state;

    const dataLayer = {
        ...rideInfo,
        event: 'RideInfo',
    };
    yield call(sendAnalytics, dataLayer);
}

function* booking() {
    const state: RootState = ((yield select()) as unknown) as RootState;
    const {
        order: { order },
    } = state;

    const dataLayer = {
        ...cleanOrder(order),
        event: 'Booking',
    };
    yield call(sendAnalytics, dataLayer);
}

function* confirm(action: OrderStatusChangedToSuccessAction) {
    const order = action.payload;

    if (order) {
        const dataLayer = {
            ...cleanOrder(order),
            event: 'Confirm',
        };
        yield call(sendAnalytics, dataLayer);

        // Типы оплаты по отдельности:
        // - ConfirmCard
        // - ConfirmMiles
        // - ConfirmCash
        // - ConfirmReccur
        // - ConfirmAtlasPromocode
        const paymentMethod = upperFirst(camelCase(order.paymentMethod));
        const dataLayerPaymentMethod = {
            ...cleanOrder(order),
            event: `Confirm${paymentMethod}`,
        };
        yield call(sendAnalytics, dataLayerPaymentMethod);

        const state: RootState = ((yield select()) as unknown) as RootState;
        // Первая покупка пользователя
        if (state.user.ordersCount === 0) {
            const dataLayerFirstBuy = {
                event: 'firstUserBuy',
            };
            yield call(sendAnalytics, dataLayerFirstBuy);
        }

        // Время с последней покупки
        // Не больше 1 месяца - lastUserBuy30d
        // Не больше 3х месяцев - lastUserBuy90d
        // Не больше 6 месяцев - lastUserBuy180d
        // Не больше 1 года - lastUserBuy360d
        // Больше 1 года - lastUserBuy999d
        const { lastPickupDate } = state.user;

        if (lastPickupDate !== undefined) {
            const dataLayerLastPickupDate = {
                event: getEventName(lastPickupDate),
            };
            yield call(sendAnalytics, dataLayerLastPickupDate);
        }
    }
}

// Применение реферального промокода
function* applyReferralPromocode(action: LoyaltyFetchingAction): SagaIterator {
    const { orderId, promocode } = action.payload;

    const { promocodeApplied } = yield race({
        promocodeApplied: take(LOYALTY_SUCCESS),
        promocodeRejected: take(LOYALTY_ERROR),
        timeout: delay(30000), // уничтожить сагу через 30сек
    });

    // Промокоды с префиксом RP- являются реферальными (пр. RP-ELRAM)
    if (promocodeApplied && /^RP\-/.test(promocode)) {
        const dataLayer = {
            orderId,
            event: `ApplyReferralPromocode`,
        };
        yield call(sendAnalytics, dataLayer);
    }
}

function* authSuccessLogging(action: UserSuccessAction) {
    const user = action.payload;
    const dataLayer = {
        event: 'authorization',
        authorized: true,
        hashedPhone: user.hashedPhone,
        ordersCount: user.ordersCount,
    };
    yield call(sendAnalytics, dataLayer, false);
}

function* referralCopyPromocode(action: UserReferralCopyPromocode) {
    const { promocode } = action.payload;
    const dataLayer = {
        event: 'userReferralCopyPromocode',
        promocode,
    };
    yield call(sendAnalytics, dataLayer);
}

function* referralSharePromocode(action: UserReferralSharePromocode) {
    const { promocode, isWebShareApiSupported } = action.payload;
    const dataLayer = {
        event: 'userReferralSharePromocode',
        promocode,
        isWebShareApiSupported,
    };
    yield call(sendAnalytics, dataLayer);
}

function* referralDialogCopyPromocode(action: UserReferralDialogCopyPromocode) {
    const { promocode } = action.payload;
    const dataLayer = {
        event: 'userReferralDialogCopyPromocode',
        promocode,
    };
    yield call(sendAnalytics, dataLayer);
}

function* referralDialogSharePromocode(
    action: UserReferralDialogSharePromocode
) {
    const { promocode, isWebShareApiSupported } = action.payload;
    const dataLayer = {
        event: 'userReferralDialogSharePromocode',
        promocode,
        isWebShareApiSupported,
    };
    yield call(sendAnalytics, dataLayer);
}

function* referralDialogDismiss() {
    const dataLayer = {
        event: 'userReferralDismissDialog',
    };
    yield call(sendAnalytics, dataLayer);
}

function* referralDialogClose() {
    const dataLayer = {
        event: 'userReferralCloseDialog',
    };
    yield call(sendAnalytics, dataLayer);
}

// Отправляем в аналитику авторизацию новых и старых пользователей
function* registerNewUser(): SagaIterator {
    const state: RootState = ((yield select()) as unknown) as RootState;
    const { isNewUser } = state.auth;

    const dataLayer = {
        event: isNewUser ? 'registerNewUser' : 'oldLoginUser',
    };
    yield call(sendAnalytics, dataLayer);
}

// Отправляем в аналитику клик по баннеру с инфой об отелях (аффилиат)
function* hotelBannerClick() {
    const dataLayer = {
        event: 'affilateСlick',
    };
    yield call(sendAnalytics, dataLayer);
}

// Отправляем в аналитику клик
// Где: SERP
// Когда: нажатие на кнопку “Фильтры”
// Условие: нет
function* filterClick() {
    const dataLayer = {
        event: 'filterСlick',
    };
    yield call(sendAnalytics, dataLayer);
}

// Отправляем в аналитику клик
// Где: страница “Остановки”
// Когда: нажатие на поле остановки ИЛИ кнопку “На карте”
// Условие: нет
function* stopsClick() {
    const dataLayer = {
        event: 'stopsСlick',
    };
    yield call(sendAnalytics, dataLayer);
}

export function* watchAnalytics(): SagaIterator {
    if (process.browser) {
        yield all([
            takeEvery(USER_SUCCESS, authSuccessLogging),
            takeEvery(USER_FETCHING_ERROR, authUnauthorizedLogging),
            takeEvery(FETCHING_RIDES_BROWSER, search),
            takeEvery(RIDE_SUCCESS, rideInfo),
            takeEvery(BOOKING_ORDER_SUCCESS, booking),
            takeEvery(ORDER_STATUS_CHANGED_TO_SUCCESS, confirm),
            takeEvery(USER_REFERRAL_COPY_PROMOCODE, referralCopyPromocode),
            takeEvery(USER_REFERRAL_SHARE_PROMOCODE, referralSharePromocode),
            takeEvery(
                USER_REFERRAL_DIALOG_COPY_PROMOCODE,
                referralDialogCopyPromocode
            ),
            takeEvery(
                USER_REFERRAL_DIALOG_SHARE_PROMOCODE,
                referralDialogSharePromocode
            ),
            takeEvery(USER_REFERRAL_DISMISS_DIALOG, referralDialogDismiss),
            takeEvery(USER_REFERRAL_CLOSE_DIALOG, referralDialogClose),
            takeEvery(LOGIN_SUCCESS, registerNewUser),
            takeLatest(LOYALTY_FETCHING, applyReferralPromocode),
            takeEvery(HOTEL_BANNER_CLICKED, hotelBannerClick),
            takeEvery(FILTER_CLICKED, filterClick),
            takeEvery(STOPS_CLICKED, stopsClick),
        ]);
    }
}
