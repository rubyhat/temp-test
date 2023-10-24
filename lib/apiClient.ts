import axios, { AxiosPromise } from 'axios';
import upperFirst from 'lodash/upperFirst';
import { currentUser } from './firebase';
import { version } from '../package.json';

import {
    AuthApiFactory,
    BookParamsDto,
    BookTicketDto,
    BookTicketResponseDto,
    BusLocationDto,
    CalculateLoyaltyResponseDto,
    CardDto,
    DefaultResponseDto,
    InvoiceDto,
    MilesBalanceDto,
    OrderDto,
    OrdersResponseDto,
    PersonalDataDto,
    RefundAmountDto,
    RideApiFactory,
    SearchApiFactory,
    SearchResultDto,
    SignupResponseDto,
    SignupVerifyResponseDto,
    SuggestResultDto,
    LocationApiFactory,
    CountryDto,
    SEOApiFactory,
    SeoDto,
    RideDto,
    UserKarmaResponseDto,
    UserDto,
    AtlasPartnerContactsDto,
    SaaSConfigDto,
    SeoDtoResponse,
    FeaturedResponseDto,
    SignUpProviderResponseDtoProviderEnum,
    RecaptchaResponseDto,
    ReviewApiFactory,
    CreateReviewBodyDto,
    OrderApiFactory,
    InvoiceDtoAcquiringEnum,
    UserApiFactory,
    UserReferralPromocodeDto,
    SeatingBookReqDto,
    SeatingBookResDto,
} from 'swagger/client';
import { i18n } from 'i18n';
import { Locale } from 'i18n/utils';
import {
    Citizenship,
    sortCountries,
    sortDocTypesByCountry,
} from 'utils/documents';
import { CountryCode } from 'utils/country';
import { OrdersType } from 'store/orders/types';
import { userLogout } from 'store/user/actions';
import { publicPath } from 'utils/publicPath';
import { PolicyState } from 'store/saasPolicyInfo/types';
import { WidgetState } from 'store/feedbackWidget/types';
import { IDataLayer } from 'sagas/analytics';

const API_BASE_PATH = process.env.INTERNAL_IP
    ? `http://${process.env.INTERNAL_IP}:${process.env.PORT || 3000}/api`
    : process.env.PROXY === 'true'
    ? `http://localhost:${process.env.PORT || 3000}/api`
    : process.browser && process.env.CORDOVA !== 'true'
    ? '/api'
    : `${process.env.BACKEND_BASE_PATH}/api`;

export const apiClient = axios.create({
    baseURL: API_BASE_PATH,
    withCredentials: true,
    headers: {
        'X-Application-Source': process.env.CORDOVA ? 'app' : 'web',
        'X-Application-Version': version,
    },
});

interface IDataLayerSendToBackend extends IDataLayer {
    site?: 'atlas' | 'compass' | '';
}
interface IDataLayerSendToBackend extends IDataLayer {
    site?: 'atlas' | 'compass' | '';
}

apiClient.interceptors.request.use(async config => {
    try {
        if (process.browser) {
            const user = await currentUser();
            if (user) {
                const token = await user.getIdToken();
                config.headers = {
                    ...config.headers,
                    Authorization: token,
                };
            } else {
                if (window.__NEXT_REDUX_STORE__) {
                    window.__NEXT_REDUX_STORE__.dispatch(userLogout());
                }
            }
        }
        return config;
    } catch (e) {
        return Promise.reject(e);
    }
});

const searchApi = SearchApiFactory(undefined, '', apiClient);
const rideApi = RideApiFactory(undefined, '', apiClient);
const authApi = AuthApiFactory(undefined, '', apiClient);
const locationApi = LocationApiFactory(undefined, '', apiClient);
const seoApi = SEOApiFactory(undefined, '', apiClient);
const reviewApi = ReviewApiFactory(undefined, '', apiClient);
const orderApi = OrderApiFactory(undefined, '', apiClient);
const userApi = UserApiFactory(undefined, '', apiClient);

export default {
    userAccountDelete(phone: string, cause: string) {
        return apiClient.post(`/user/remove/${phone}`, { cause });
    },
    searchSuggestGet(
        userInput: string = '',
        fromId: string = '',
        toId: string = ''
    ): AxiosPromise<SuggestResultDto[]> {
        userInput = upperFirst(userInput);

        // Аргумент `locale` никак не обрабатывается бекендом.
        // Он нужен для формирования уникальных URL на разных языках
        // чтобы кеши в SW не переписывали друг друга
        return apiClient.get(`/search/suggest`, {
            params: {
                user_input: userInput,
                from_id: fromId,
                to_id: toId,
                locale: i18n.language,
            },
            headers: {
                'Accept-Language': i18n.language,
            },
        });
    },
    searchGet(
        fromId: string,
        toId: string,
        date: string,
        passengers: string,
        projectIdentifier: string,
        calendarWidth: string = '30',
        time?: string,
        SAASPartner?: string
    ): AxiosPromise<SearchResultDto> {
        const options: any = {
            headers: {},
        };
        if (SAASPartner) options.headers['X-SAAS-Partner-Id'] = SAASPartner;

        return searchApi.searchRides(
            fromId,
            toId,
            date,
            passengers,
            projectIdentifier,
            calendarWidth,
            time,
            options
        );
    },
    getRide(id: string): AxiosPromise<RideDto> {
        return rideApi.getRide(id);
    },
    bookingSeatingTemp(
        data: SeatingBookReqDto
    ): AxiosPromise<SeatingBookResDto> {
        return rideApi.bookSeatingTemp(data);
    },
    getBookParams(
        id: string,
        fromId: string,
        toId: string,
        date: string,
        country: CountryCode = 'UA'
    ): AxiosPromise<BookParamsDto> {
        return rideApi.getRideBookParams(id, fromId, toId, date).then(res => {
            sortDocTypesByCountry(res.data.docTypes, country);
            return res;
        });
    },
    authCode(
        phoneNumber: string,
        captchaToken: string,
        useFirebase: boolean,
        ts?: string, // ISO строка с датой и временем инициализации запроса
        s?: string // подпись запроса
    ): AxiosPromise<SignupResponseDto> {
        phoneNumber = phoneNumber.replace(/[^\d]/g, '');

        return authApi.signup({
            captchaToken,
            phoneNumber,
            useFirebase,
            ts,
            s,
        });
    },
    recaptchaKeys(): AxiosPromise<RecaptchaResponseDto> {
        return authApi.getRecaptchaKeys();
    },
    async authProvider(
        phoneNumber: string
    ): Promise<SignUpProviderResponseDtoProviderEnum> {
        phoneNumber = phoneNumber.replace(/[^\d]/g, '');
        const response = await authApi.getAuthProvider(phoneNumber as any);
        return response.data.provider;
    },
    auth(
        smsToken: string,
        phoneNumber: string
    ): AxiosPromise<SignupVerifyResponseDto> {
        phoneNumber = phoneNumber.replace(/[^\d]/g, '');

        return authApi.signupVerify({
            smsToken,
            phoneNumber,
        });
    },
    // Проксируется в Backend.
    // Вызывать только на клиенте т.к. `baseURL` не задан.
    authSessionLogin(idToken: string, remember: boolean): AxiosPromise<void> {
        return apiClient.post('/auth/sessionLogin', {
            idToken,
            csrfToken: '', // @todo Backend: nuke property
            remember,
        });
    },
    // Проксируется в Backend.
    // Вызывать только на клиенте т.к. `baseURL` не задан.
    authSessionLogout(): AxiosPromise<void> {
        return apiClient.post('/auth/sessionLogout');
    },
    // Проксируется в Backend.
    // Вызывать только на клиенте т.к. `baseURL` не задан.
    getUser(): AxiosPromise<
        Omit<UserDto, 'phoneNumber'> & { phoneNumber: string } // @todo исправить тип в минибэке
    > {
        return apiClient.get('/user');
    },
    getSaasPolicyInfo(
        partner: string,
        countryCode?: CountryCode,
        version?: string
    ): AxiosPromise<PolicyState> {
        return apiClient.post('/saas/policy', {
            partner,
            countryCode,
            version,
        });
    },
    setUserPolicyVersion(
        policyVersion: string
    ): AxiosPromise<Omit<UserDto, 'phoneNumber'> & { phoneNumber: string }> {
        return apiClient.put('/user/policy', { policyVersion });
    },
    sendFeedbackForm(formdData: WidgetState): AxiosPromise {
        return apiClient.post('/zammad/add', formdData);
    },
    verifyPhoneNumber(
        phoneNumber: string,
        captchaToken: string,
        useFirebase: boolean
    ): Promise<void> {
        phoneNumber = phoneNumber.replace(/[^\d]/g, '');

        return authApi
            .verifyPhoneNumber({
                phoneNumber,
                captchaToken,
                useFirebase,
            })
            .then(({ data }) => {
                if (data.success) return;

                throw new Error("Phone doesn't exist");
            });
    },
    getSaasUpdateVersion(
        partner: string,
        platform: 'ios' | 'android' | 'all',
        type: 'forced' | 'recommended'
    ): AxiosPromise<{ version: string }> {
        return apiClient.post('/saas/app-version', { partner, platform, type });
    },
    sendOrder(data: BookTicketDto): AxiosPromise<BookTicketResponseDto> {
        return apiClient.post('/orders', data);
    },
    getOrder(id: string): AxiosPromise<OrderDto> {
        return apiClient.get(`/orders/${id}`);
    },
    createInvoice(
        orderId: string,
        redirectURL?: string
    ): AxiosPromise<InvoiceDto> {
        return orderApi.initializeCardPayment(orderId, redirectURL);
    },
    // Оплата милями или наличными
    confirmOrder(
        orderId: string,
        paymentType: 'miles' | 'cash'
    ): AxiosPromise<DefaultResponseDto> {
        return apiClient.post(`/orders/${orderId}/confirm`, {
            paymentType,
        });
    },
    getMilesBalance(): AxiosPromise<MilesBalanceDto> {
        return apiClient.get('/miles/balance');
    },
    getOrders(
        page: number,
        perPage: number = 10,
        type: OrdersType
    ): AxiosPromise<OrdersResponseDto> {
        return apiClient.get(`/orders`, {
            params: {
                limit: perPage,
                offset: (page - 1) * perPage,
                type,
                orderBy: type === 'upcoming' ? 'asc' : 'desc',
            },
        });
    },
    cancelAndRefund(ticketId: string): AxiosPromise<DefaultResponseDto> {
        return apiClient.post(`/tickets/${ticketId}/cancel`);
    },
    cancelBooking(orderId: string): AxiosPromise<DefaultResponseDto> {
        return apiClient.post(`/orders/${orderId}/cancel`);
    },
    calcRefund(ticketId: string): AxiosPromise<RefundAmountDto> {
        return apiClient.get(`/tickets/${ticketId}/calc-refund`);
    },
    getCards(
        acquiring?: InvoiceDtoAcquiringEnum,
        currency?: string
    ): AxiosPromise<Array<CardDto>> {
        return apiClient.get('/user/cards', {
            params: {
                acquiring,
                currency,
            },
        });
    },
    deleteCard(cardId: string | number): AxiosPromise {
        return apiClient.delete(`/user/cards/${cardId}`);
    },
    payRecurrent(orderId: string, cardId: number | string): AxiosPromise {
        return apiClient.post('/orders/pay/recurrent', {
            orderId,
            cardId,
        });
    },
    getDocuments(): AxiosPromise<PersonalDataDto> {
        return apiClient.get('/user/documents');
    },
    deleteDocument(document: PersonalDataDto): AxiosPromise {
        return apiClient.delete(`/user/documents`, {
            data: document,
        });
    },
    getCitizenships(country: CountryCode): AxiosPromise<Citizenship[]> {
        return axios.get(publicPath('/static/countries.json')).then(res => {
            sortCountries(res.data, country);
            return res;
        });
    },
    loyaltyCalc(
        orderId: string,
        promocode: string = ''
    ): AxiosPromise<CalculateLoyaltyResponseDto> {
        return apiClient.post('/loyalty/calc', {
            orderId,
            promocode,
        });
    },
    getBusLocation(orderId: string): AxiosPromise<BusLocationDto> {
        return apiClient.get(`/location/orders/${orderId}`);
    },
    getUserCountry(): AxiosPromise<CountryDto> {
        return locationApi.getCountry();
    },
    getSeoDirection(
        locale: Locale,
        from: string,
        to: string,
        SAASPartner: string,
        xForwardedFor?: string,
        hostname?: string
    ): AxiosPromise<SeoDtoResponse> {
        const options: any = {
            headers: {},
        };
        if (SAASPartner) options.headers['X-SAAS-Partner-Id'] = SAASPartner;
        if (xForwardedFor) {
            options.headers['X-Forwarded-For'] = xForwardedFor;
            options.headers['X-Real-IP'] = xForwardedFor;
        }
        if (hostname) {
            options.headers['X-Real-Host'] = hostname;
        }

        // Для направлений типа: Правые+Мосты
        // axios кодирует + в %2B,
        // а бекенд может обработать только %20 или + (не кодированный)
        from = from.replace(/\+/g, ' ');
        to = to.replace(/\+/g, ' ');

        return seoApi.getSeo(locale, from, to, options);
    },
    getSeoList(
        locale: Locale,
        SAASPartner: string,
        fromId?: string,
        fromName?: string,
        xForwardedFor?: string
    ): AxiosPromise<SeoDto[]> {
        const options: any = {
            headers: {},
        };
        if (SAASPartner) options.headers['X-SAAS-Partner-Id'] = SAASPartner;
        if (xForwardedFor) {
            options.headers['X-Forwarded-For'] = xForwardedFor;
            options.headers['X-Real-IP'] = xForwardedFor;
        }

        // Для направлений типа: Правые+Мосты
        // axios кодирует + в %2B,
        // а бекенд может обработать только %20 или + (не кодированный)
        fromName = fromName && fromName.replace(/\+/g, ' ');

        return seoApi.getSeoList(
            locale,
            fromId,
            fromName,
            undefined,
            undefined,
            options
        );
    },
    getSeoFeatured(
        locale: Locale,
        SAASPartner: string,
        xForwardedFor?: string
    ): AxiosPromise<FeaturedResponseDto> {
        const options: any = {
            headers: {},
        };
        if (SAASPartner) options.headers['X-SAAS-Partner-Id'] = SAASPartner;
        if (xForwardedFor) {
            options.headers['X-Forwarded-For'] = xForwardedFor;
            options.headers['X-Real-IP'] = xForwardedFor;
        }

        return seoApi.getSeoFeatured(locale, options);
    },
    getUserKarma(): AxiosPromise<UserKarmaResponseDto> {
        return apiClient.get(`/karma`);
    },
    getPartners(): AxiosPromise<AtlasPartnerContactsDto[]> {
        return searchApi.getPartnersContacts();
    },
    getSAASPartners(): AxiosPromise<SaaSConfigDto[]> {
        return apiClient.get('/saas');
    },
    getSaaSPartner(partnerId: string): AxiosPromise<SaaSConfigDto> {
        return apiClient.get(`/saas/${partnerId}`);
    },
    ordersToReview() {
        return reviewApi.reviewControllerGetReviews();
    },
    submitReview(review: CreateReviewBodyDto) {
        return reviewApi.reviewControllerPostReview(review);
    },
    skipReview(orderId: string) {
        return reviewApi.reviewControllerSkipReview(orderId);
    },
    getUserReferralPromocode(): AxiosPromise<UserReferralPromocodeDto> {
        return userApi.getUserReferralPromocode();
    },
    async sendAnalyticsToBackend(data: IDataLayerSendToBackend) {
        const user = localStorage.getItem('user');
        const userParse = user ? JSON.parse(user) : null;
        const user_id = user
            ? userParse.hasOwnProperty('hashedPhone')
                ? userParse.hashedPhone
                : null
            : null;

        const body = { data, user_id };
        const res = await apiClient.post(`analytics/`, body);
        return res;
    },
};
