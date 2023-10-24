import { UpdateAppModal } from 'components/UpdateApp/UpdateAppModal';
import React from 'react';
import { version } from 'package.json';
import { usePlatform } from 'hooks/usePlatform';
import { useSelector } from 'react-redux';
import { RootState } from 'store';
import { SaasUpdateVersionState } from 'store/saasUpdateVersion/types';
import { iOS } from 'utils/platform';
import { appStoreURL, googlePlayURL } from 'utils/appStore';

export const UpdateAppWrapper = () => {
    const { isCordova, isMobile } = usePlatform();
    const [isOpen, setIsOpen] = React.useState<boolean>(isCordova);
    const { forced, recommended } = useSelector<
        RootState,
        SaasUpdateVersionState
    >(rootState => rootState.saasUpdateVersion);

    React.useEffect(() => {
        const calcVersion = (version: string) =>
            Number(version.split('.').join(''));

        const userHasOldVersion = (
            userVersion: string,
            serverVersion: string = '0'
        ) => calcVersion(userVersion) < calcVersion(serverVersion);

        const isNeedUpdate =
            userHasOldVersion(version, forced) ||
            userHasOldVersion(version, recommended);

        setIsOpen(isNeedUpdate);
    }, [forced, recommended, isCordova]);

    return (
        <UpdateAppModal
            open={isOpen}
            setIsOpen={setIsOpen}
            data={{
                title: 'Время обновляться!',
                subtitle: `Обновите ${
                    isCordova ? 'приложение' : 'страницу'
                }, чтобы воспользоваться новыми возможностями`,
                buttonTitle: `Обновить ${
                    isCordova ? 'приложение' : 'страницу'
                }`,
                required: Boolean(forced) && forced !== version,
                link: iOS() ? appStoreURL : googlePlayURL,
                isCordova: isCordova,
                isMobile: isMobile,
            }}
        />
    );
};
