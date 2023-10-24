import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';

export function useCancelBooking() {
    const router = useRouter();

    const [cancelDialogOpen, setCancelDialogOpen] = useState(false);
    useEffect(() => {
        if (process.browser) {
            router.beforePopState(props => {
                setCancelDialogOpen(true);
                window.history.forward();
                return false;
            });
        }
        // Clear event on unmount
        return () => router.beforePopState(() => true);
    }, [router]);

    return {
        cancelDialogOpen,
        setCancelDialogOpen,
    };
}
