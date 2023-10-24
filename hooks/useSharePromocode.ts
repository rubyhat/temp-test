import { useState } from 'react';
import useWebShare from 'react-use-web-share';

import { CountryCode } from 'utils/country';
import { ShareData } from 'components/social/types';
import { useCountry } from 'hooks/useCountry';
import { useTranslation } from 'i18n';

function getHostname(country: CountryCode) {
    if (process.env.APP_STAGE === 'testing') {
        return 'testing.www.atlasbus.ru';
    } else if (country === 'BY') {
        return 'atlasbus.by';
    }

    return 'atlasbus.ru';
}

export function useSharePromocode(
    promocode: string,
    enableWebShareApi: boolean = false,
    onShare?: (promocode: string, isWebShareApiSupported: boolean) => void
) {
    const { t } = useTranslation();
    const { country } = useCountry();
    const [dialogOpen, setDialogOpen] = useState(false);
    const handleClose = () => {
        document.body.style.overflow = 'auto';
        setDialogOpen(false);
    };

    const hostname = getHostname(country);
    const shareData: ShareData = {
        text: t('referralShareMessengerMessage', { promocode }),
        url: `https://${hostname}/referral?promocode=${promocode}`,
    };

    const { isSupported, share } = useWebShare();

    const handleShare = () => {
        if (enableWebShareApi && isSupported) {
            share(shareData);
        } else {
            // fallback на кастомный диалог
            setDialogOpen(true);
        }

        if (onShare) {
            onShare(promocode, isSupported);
        }
    };

    return {
        dialogOpen,
        handleClose,
        handleShare,
        shareData,
    };
}
