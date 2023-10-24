import React, { useEffect, useState } from 'react';
import { AtlasCookieModal } from 'components/Cookie/AtlasCookieModal';
import { CompasCookieModal } from '../CompasCookieModal';
import { useSelector } from 'react-redux';
import { RootState } from 'store';
import { CountryState } from 'store/country/types';
import Cookies from 'universal-cookie';
import { isCordova } from 'utils/platform';
import { useSAAS } from '../../../hooks/useSAAS';

const CookieModalWrapper = () => {
    const [isOpen, setIsOpen] = useState(false);
    const { isAtlas, isCompasBus } = useSAAS();
    const cookies = new Cookies();
    const { country } = useSelector<RootState, CountryState>(
        rootState => rootState.country
    );
    const isAccepted = cookies.get('cookiesAccepted');

    useEffect(() => {
        if (isAtlas) {
            const isValid = country !== 'PL';
            if (isValid && isAccepted !== 'true') {
                setIsOpen(true);
            }
        }
        if (isCompasBus) {
            if (isAccepted !== 'true') {
                setIsOpen(true);
            }
        }
    }, [country, isAccepted, isAtlas, isCompasBus]);

    const acceptCookie = (withAd?: boolean) => {
        setIsOpen(false);
        if (isAtlas) {
            cookies.set('cookiesAccepted', 'true', { maxAge: 31536000 });
        }
        if (isCompasBus) {
            cookies.set('cookiesAccepted', 'true', { maxAge: 31536000 });
            cookies.set('cookiesAdAccepted', withAd, { maxAge: 31536000 });
        }
    };

    return (
        <>
            {!isCordova && isAtlas && (
                <AtlasCookieModal isOpen={isOpen} acceptCookie={acceptCookie} />
            )}
            {!isCordova && isCompasBus && (
                <CompasCookieModal
                    isOpen={isOpen}
                    acceptCookie={acceptCookie}
                />
            )}
        </>
    );
};

export default React.memo(CookieModalWrapper);
