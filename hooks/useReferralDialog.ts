import { useDispatch, useSelector } from 'react-redux';
import Cookie from 'universal-cookie';
import addDays from 'date-fns/addDays';

import {
    userReferralCloseDialog,
    UserReferralDialogState,
    userReferralDismissDialog,
} from 'store/user-referral-dialog';
import { RootState } from 'store';
import { isDebugging } from 'utils/debugging/storage';

const cookie = new Cookie();

export const REFERRAL_DIALOG_COOKIE_KEY = 'referral-dialog';

export function getReferralDialogCookie(): boolean {
    return !!cookie.get(REFERRAL_DIALOG_COOKIE_KEY);
}

export function setReferralDialogCookie(days: number) {
    cookie.set(REFERRAL_DIALOG_COOKIE_KEY, true, {
        expires: addDays(new Date(), days),
    });
}
export function useReferralDialog() {
    const dispatch = useDispatch();
    const { userCopiedPromocode, userSharedPromocode } = useSelector<
        RootState,
        UserReferralDialogState
    >(rootState => rootState.userReferralDialog);

    const { showDialog } = useSelector<RootState, UserReferralDialogState>(
        rootState => rootState.userReferralDialog
    );
    const handleClose = () => {
        // Если пользователь скопировал или поделился промокодом,
        // просто закрываем диалог, при этом НЕ отправляя событие
        // `userReferralDismissDialog` в GTM
        if (userCopiedPromocode || userSharedPromocode) {
            dispatch(userReferralCloseDialog());
            document.body.style.overflow = 'auto';
            // Ставим куку навечно
            setReferralDialogCookie(365 * 10); // на 10 лет думаю хватит, как минимум я тут точно уже не буду работать
        } else {
            dispatch(userReferralDismissDialog());
            document.body.style.overflow = 'auto';
            // Ставим куку на 30 дней
            setReferralDialogCookie(30);
        }
    };
    const handleDismiss = () => {
        // Если нажал "Поделюсь потом" ставим куку на 30 дней
        setReferralDialogCookie(30);
        document.body.style.overflow = 'auto';
        dispatch(userReferralDismissDialog());
    };

    return {
        open: showDialog,
        handleClose,
        handleDismiss,
        showDialog: !getReferralDialogCookie() || isDebugging('referral'),
    };
}
