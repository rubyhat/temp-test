import { useEffect, useState } from 'react';
import { NextRouter, useRouter } from 'next/router';

// Хук для контроля состояния Dialog'а на основе свойства Location: hash
export function useDialogHash(
    hash: string
): [boolean, (open: boolean) => void] {
    const [open, setOpen] = useState(false);
    const router = useRouter();

    const toggleDialog = (value: boolean) => {
        if (value) {
            // navigate to same url but with the specified hash
            pushHash(router, hash);
        } else {
            // remove the hash
            router.back();
        }
    };

    // Если открыть ссылку с хешем напрямую http://localhost:3000/#suggest-from
    // потом нажать на Саджест (откуда), `history.length == 1` не изменится.
    // Диалог нельзя будет закрыть т.к. `router.back()` некуда переходить
    // назад в истории.
    //
    // Решение: При монтировании любой хеш будет заменен на #.
    // Подсмотрел у гугла.
    //
    // https://t.carbus.io/youtrack/issue/ATLASDEV-896
    //
    // UPD:
    // Фикс породил другую багу
    // https://t.carbus.io/youtrack/issue/ATLASDEV-896#focus=Comments-4-4702.0-0
    //
    // useEffect(() => {
    //     if (window.location.hash) {
    //         window.location.hash = '';
    //     }
    // }, []);

    useEffect(() => {
        const handler = () => {
            const isHashMatch = window.location.hash === hash;
            setOpen(isHashMatch);
        };

        router.events.on('hashChangeComplete', handler);

        return () => router.events.off('hashChangeComplete', handler);
    }, []);

    return [open, toggleDialog];
}

// Делает ту же работу что и window.location.assign('#hash'),
// только уведомляет об этом NextRouter.
// Если делать без роутера, Next.js будет каждый раз вызывать getInitialProps,
// что нежелательно.
function pushHash(router: NextRouter, hash: string) {
    const as = window.location.pathname + window.location.search + hash;

    router.push(
        {
            pathname: router.pathname,
            query: router.query,
        },
        as,
        { shallow: true }
    );
}
