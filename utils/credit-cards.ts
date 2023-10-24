import upperFirst from 'lodash/upperFirst';

const cards: Record<string, RegExp> = {
    electron: /^(4026|417500|4405|4508|4844|4913|4917)/,
    maestro: /^(5018|5020|5038|5612|5893|6304|6759|6761|6762|6763|0604|6390)/,
    dankort: /^(5019)/,
    interpayment: /^(636)/,
    unionpay: /^(62|88)/,
    visa: /^4/,
    mastercard: /^5[1-5]/,
    amex: /^3[47]/,
    diners: /^3(?:0[0-5]|[68][0-9])/,
    discover: /^6(?:011|5[0-9]{2})/,
    jcb: /^(?:2131|1800|35\d{3})/,
    mir: /^2/,
};

// Example: 424242******4242
// Source: https://stackoverflow.com/questions/72768/how-do-you-detect-credit-card-type-based-on-number
export function detectCardTypeByMask(mask: string): string {
    for (let key in cards) {
        if (cards[key].test(mask)) {
            return key;
        }
    }
    return '';
}

export function getCardNameByMask(mask: string) {
    const name = detectCardTypeByMask(mask);

    return `${upperFirst(name)} ${mask.slice(-6)}`;
}

/**
 * @param expires Срок окончания действия карты. В формате MMYY, где YY — две последние цифры года
 */
export function formatCardExpirationDate(expires: string) {
    const month = expires.substr(0, 2);
    const year = expires.substr(2, 2);

    return `${month}/${year}`;
}
