type StorageKey = 'review' | 'referral';

const storageKey: Record<StorageKey, string> = {
    review: 'debuggingReview',
    referral: 'debuggingReferral',
};

export const storage = {
    getReview(): boolean {
        if (!process.browser) return false;

        try {
            const valueString = localStorage.getItem(storageKey.review);
            const value =
                valueString !== null ? JSON.parse(valueString) : false;

            return typeof value === 'boolean' ? value : false;
        } catch (err) {
            console.log(err);
            return false;
        }
    },
    setReviewOrder(value: boolean) {
        if (!process.browser) return;

        localStorage.setItem(storageKey.review, JSON.stringify(value));
    },
    removeReviewOrder() {
        if (!process.browser) return;

        localStorage.removeItem(storageKey.review);
    },
    getUserReferral(): boolean {
        if (!process.browser) return false;

        try {
            const valueString = localStorage.getItem(storageKey.referral);
            const value =
                valueString !== null ? JSON.parse(valueString) : false;

            return typeof value === 'boolean' ? value : false;
        } catch (err) {
            console.log(err);
            return false;
        }
    },
    setUserReferral(value: boolean) {
        if (!process.browser) return;

        localStorage.setItem(storageKey.referral, JSON.stringify(value));
    },
    removeUserReferral() {
        if (!process.browser) return;

        localStorage.removeItem(storageKey.referral);
    },
};

export function isDebugging(key: StorageKey): boolean {
    if (!process.browser) return false;

    try {
        const valueString = localStorage.getItem(storageKey[key]);
        const value = valueString !== null ? JSON.parse(valueString) : false;

        return typeof value === 'boolean' ? value : false;
    } catch (err) {
        console.log(err);
        return false;
    }
}
