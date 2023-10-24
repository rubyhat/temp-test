import {
    applyMiddleware,
    createStore,
    combineReducers,
    Store as ReduxStore,
} from 'redux';
import createSagaMiddleware, { Task } from 'redux-saga';
import { MakeStoreOptions } from 'next-redux-wrapper';
import { composeWithDevTools } from 'redux-devtools-extension';

import { indexSaga } from '../sagas';
import { searchRidesReducer } from './search-rides/reducers';
import { searchFormReducer } from './search-form/reducers';
import { lastSearchReducer } from './last-search/reducers';
import { bookingReducer } from './booking/reducers';
import { authReducer } from './auth/reducers';
import { authRecaptchaReducer } from './auth-recaptcha/reducers';
import { userReducer } from './user/reducers';
import { filtersReducer } from './filters/reducers';
import { rideReducer } from './ride/reducers';
import { orderReducer } from './order/reducers';
import { ordersReducer } from './orders/reducers';
import { milesReducer } from './miles/reducers';
import { ticketReducer } from './ticket/reducers';
import { creditCardsReducer } from './credit-cards/reducers';
import { documentsReducer } from './documents/reducers';
import {
    suggestionFromReducer,
    suggestionToReducer,
} from './suggestion/reducers';
import { countryReducer } from './country/reducers';
import { loyaltyReducer } from './loyalty/reducers';
import { busLocationReducer } from './bus-location/reducers';
import { invoiceReducer } from './invoice/reducers';
import { paymentReducer } from './payment/reducers';
import { karmaReducer } from './karma/reducers';
import { deviceReducer } from './device/reducers';
import { brandReducer } from './brand/reducers';
import { partnersReducer } from './partners/reducers';
import { seoReducer } from './seo/reducers';
import { seoFeaturedReducer } from './seo-featured/reducers';
import { seoCityReducer } from './seo-city/reducers';
import { pwaInstallReducer, PWAInstallActionTypes } from 'store/pwa-install';
import { reviewOrdersReducer } from 'store/reviews/review-orders';
import { reviewAnswersReducer } from 'store/reviews/review-answers';
import { submitReviewReducer } from 'store/reviews/submit-review';
import { skipReviewReducer } from 'store/reviews/skip-review';
import { geolocationReducer } from 'store/geolocation';
import { bookingGeolocationReducer } from 'store/booking-geolocation';
import { userReferralReducer } from 'store/user-referral';
import { userReferralDialogReducer } from 'store/user-referral-dialog';
import { SearchRidesActionTypes } from './search-rides/types';
import { LastSearchActionTypes } from './last-search/types';
import { SearchFormActionTypes } from './search-form/types';
import { AuthActionTypes } from './auth/types';
import { RecaptchaActionTypes } from 'store/auth-recaptcha/types';
import { UserActionTypes } from './user/types';
import { BookingActionTypes } from './booking/types';
import { RideActionTypes } from './ride/types';
import { OrderActionTypes } from './order/types';
import { OrdersActionTypes } from './orders/types';
import { MilesActionTypes } from './miles/types';
import { TicketActionTypes } from './ticket/types';
import { CardsActionTypes } from './credit-cards/types';
import { DocumentsActionTypes } from './documents/types';
import { SuggestionActionTypes } from './suggestion/types';
import { CountryActionTypes } from './country/types';
import { LoyaltyActionTypes } from './loyalty/types';
import { BusLocationActionTypes } from './bus-location/types';
import { InvoiceActionTypes } from './invoice/types';
import { PaymentActionTypes } from './payment/types';
import { KarmaActionTypes } from './karma/types';
import { DeviceActionTypes } from './device/types';
import { BrandActionTypes } from './brand/types';
import { PartnersActionTypes } from './partners/types';
import { SeoActionTypes } from './seo/types';
import { SeoFeaturedActionTypes } from 'store/seo-featured/types';
import { SeoCityActionTypes } from 'store/seo-city/types';
import { ReviewOrdersActionTypes } from 'store/reviews/review-orders';
import { ReviewAnswersActionTypes } from 'store/reviews/review-answers';
import { SubmitReviewActionTypes } from 'store/reviews/submit-review';
import { SkipReviewActionTypes } from 'store/reviews/skip-review';
import { GeolocationActionTypes } from 'store/geolocation';
import { BookingGeolocationActionTypes } from 'store/booking-geolocation';
import { UserReferralActionTypes } from 'store/user-referral';
import { UserReferralDialogActionTypes } from 'store/user-referral-dialog';
import { widgetReducer } from 'store/feedbackWidget/reducers';
import { policyReducer } from 'store/saasPolicyInfo/reducers';
import { saasUpdateVersionReducer } from 'store/saasUpdateVersion/reducers';
import { SaasUpdateVersionActionTypes } from 'store/saasUpdateVersion/types';
import { PolicyActionTypes } from 'store/saasPolicyInfo/types';

export type RootState = ReturnType<typeof rootReducer>;
export type ActionTypes =
    | SearchRidesActionTypes
    | SearchFormActionTypes
    | LastSearchActionTypes
    | AuthActionTypes
    | RecaptchaActionTypes
    | UserActionTypes
    | BookingActionTypes
    | RideActionTypes
    | OrderActionTypes
    | OrdersActionTypes
    | MilesActionTypes
    | TicketActionTypes
    | CardsActionTypes
    | DocumentsActionTypes
    | SuggestionActionTypes
    | CountryActionTypes
    | LoyaltyActionTypes
    | BusLocationActionTypes
    | InvoiceActionTypes
    | PaymentActionTypes
    | KarmaActionTypes
    | DeviceActionTypes
    | BrandActionTypes
    | PartnersActionTypes
    | SeoActionTypes
    | SeoFeaturedActionTypes
    | SeoCityActionTypes
    | PWAInstallActionTypes
    | ReviewOrdersActionTypes
    | ReviewAnswersActionTypes
    | SubmitReviewActionTypes
    | SkipReviewActionTypes
    | GeolocationActionTypes
    | BookingGeolocationActionTypes
    | UserReferralActionTypes
    | UserReferralDialogActionTypes
    | SaasUpdateVersionActionTypes
    | PolicyActionTypes;
export type Store = ReduxStore<RootState, ActionTypes> & {
    sagaTask?: Task;
};

export const rootReducer = combineReducers({
    searchForm: searchFormReducer,
    lastSearch: lastSearchReducer,
    searchRides: searchRidesReducer,
    auth: authReducer,
    authRecaptcha: authRecaptchaReducer,
    user: userReducer,
    booking: bookingReducer,
    order: orderReducer,
    orders: ordersReducer,
    ride: rideReducer,
    filters: filtersReducer,
    miles: milesReducer,
    ticket: ticketReducer,
    cards: creditCardsReducer,
    documents: documentsReducer,
    suggestionFrom: suggestionFromReducer,
    suggestionTo: suggestionToReducer,
    country: countryReducer,
    loyalty: loyaltyReducer,
    busLocation: busLocationReducer,
    invoice: invoiceReducer,
    payment: paymentReducer,
    karma: karmaReducer,
    device: deviceReducer,
    brand: brandReducer,
    partners: partnersReducer,
    seo: seoReducer,
    seoFeatured: seoFeaturedReducer,
    seoCity: seoCityReducer,
    pwaInstall: pwaInstallReducer,
    policy: policyReducer,
    reviewOrders: reviewOrdersReducer,
    reviewAnswers: reviewAnswersReducer,
    submitReview: submitReviewReducer,
    skipReview: skipReviewReducer,
    geolocation: geolocationReducer,
    bookingGeolocation: bookingGeolocationReducer,
    userReferral: userReferralReducer,
    userReferralDialog: userReferralDialogReducer,
    widget: widgetReducer,
    saasUpdateVersion: saasUpdateVersionReducer,
});

export const makeStore = (
    initialState: RootState,
    options: MakeStoreOptions
): Store => {
    const { isServer, req = null } = options;

    const sagaMiddleware = createSagaMiddleware();
    const middlewares = [sagaMiddleware];

    const store = createStore(
        rootReducer,
        initialState,
        composeWithDevTools(applyMiddleware(...middlewares))
    );

    if (req || !isServer) {
        return {
            ...store,
            sagaTask: sagaMiddleware.run(indexSaga),
        };
    }

    return store;
};
