import { useEffect, useState } from 'react';

import { storage } from 'utils/debugging/storage';

export function useDebugging() {
    const [reviewOrder, setReviewOrder] = useState(false);
    const changeReviewOrder = (value: boolean) => {
        if (value) {
            storage.setReviewOrder(value);
        } else {
            storage.removeReviewOrder();
        }
        setReviewOrder(value);
    };
    useEffect(() => {
        setReviewOrder(storage.getReview());
    }, []);

    const [referral, setReferral] = useState(false);
    const changeReferral = (value: boolean) => {
        if (value) {
            storage.setUserReferral(value);
        } else {
            storage.removeUserReferral();
        }
        setReferral(value);
    };
    useEffect(() => {
        setReferral(storage.getUserReferral());
    }, []);

    return {
        reviewOrder,
        setReviewOrder: changeReviewOrder,
        referral,
        setReferral: changeReferral,
    };
}
