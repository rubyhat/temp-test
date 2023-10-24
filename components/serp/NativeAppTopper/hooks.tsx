import { useState } from 'react';

import { setCookie } from './cookies';
import { useSAAS } from 'hooks/useSAAS';

export function useNativeAppTopper(openProp: boolean) {
    const { meta } = useSAAS();
    const [open, setOpen] = useState<boolean>(openProp);

    const handleClose = () => {
        setOpen(false);
        setCookie();
    };

    return {
        open,
        handleClose,
        visible: open && meta.nativeAppTopperEnabled,
    };
}
