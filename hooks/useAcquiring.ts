import { useDispatch, useSelector } from 'react-redux';
import * as Sentry from '@sentry/browser';
import { Severity } from '@sentry/browser';

import {
    cordovaAcquiringPaymentSuccess,
    openAcquiringPaymentPage,
} from 'store/payment/actions';
import { InvoiceState } from 'store/invoice/types';
import { OrderState } from 'store/order/types';
import { PaymentState } from 'store/payment/types';
import { RootState } from 'store';
import { getAcquiringInAppBrowserOptions } from 'utils/acquiring';
import { useTranslation } from 'i18n';

export function useAcquiring() {
    const dispatch = useDispatch();
    const { t } = useTranslation();

    const { order } = useSelector<RootState, OrderState>(
        rootState => rootState.order
    );
    const { invoice } = useSelector<RootState, InvoiceState>(
        rootState => rootState.invoice
    );
    const confirmationUrl = invoice && invoice.confirmationUrl;

    const { saveCreditCard } = useSelector<RootState, PaymentState>(
        rootState => rootState.payment
    );

    const openAcquiringConfirmationURL = () => {
        if (!confirmationUrl) {
            Sentry.captureMessage(
                'useAcquiring(): `invoice` or `invoice.confirmationUrl` is undefined',
                Severity.Fatal
            );

            return;
        }

        if (!order) {
            Sentry.captureMessage(
                'useAcquiring(): `order` is undefined',
                Severity.Fatal
            );

            return;
        }

        // Если галочка "Сохранить карту" чекнута и
        // URL для оплаты картой присутствует в инвойсе
        // используем ссылку с "сохранением карты"
        const finalConfirmationUrl =
            confirmationUrl.confirmAndSave && saveCreditCard
                ? confirmationUrl.confirmAndSave
                : confirmationUrl.confirm;

        if (!window.cordova) {
            window.location.replace(finalConfirmationUrl);
        } else {
            const acquiringWebView = window.cordova.InAppBrowser.open(
                finalConfirmationUrl,
                '_blank',
                getAcquiringInAppBrowserOptions(t)
            );

            const onNavigate = (e: InAppBrowserEvent) => {
                const url = new URL(e.url);

                if (url.host === 'success') {
                    acquiringWebView.removeEventListener(
                        'loadstart',
                        onNavigate
                    );
                    acquiringWebView.close();

                    dispatch(cordovaAcquiringPaymentSuccess());
                }
            };

            acquiringWebView.addEventListener('loadstart', onNavigate);
        }

        // для Analytics
        dispatch(openAcquiringPaymentPage(confirmationUrl, saveCreditCard));
    };

    return {
        openAcquiringConfirmationURL,
    };
}
