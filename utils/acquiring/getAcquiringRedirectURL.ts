export function getAcquiringRedirectURL(orderId: string) {
    // Пути в веб версии и приложении отличаются:
    // - Веб: /success/[orderId]
    // - Приложение: /success/?id=[orderId]
    //
    // Как альтернатива можно и так:
    // `https://atlasbus.app/success/?id=${orderId}`
    if (window.cordova) {
        return 'http://success';
    }

    return `${window.location.origin}/success/${orderId}`;
}
