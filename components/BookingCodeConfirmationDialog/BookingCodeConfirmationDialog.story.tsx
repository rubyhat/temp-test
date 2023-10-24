import React, { ChangeEvent, useState } from 'react';
import { storiesOf } from '@storybook/react';

import { BookingCodeConfirmationDialog } from './BookingCodeConfirmationDialog';
import { Button } from '../ui/Button';

storiesOf('BookingCodeConfirmationDialog', module).add('default', () => {
    const Component = () => {
        const [open, setOpen] = useState(true);
        const handleClose = () => {
            document.body.style.overflow = 'auto';
            setOpen(false);
        };
        const handleOpen = () => {
            setOpen(true);
        };

        const [code, setCode] = useState('');
        const handleCodeChange = (e: ChangeEvent<HTMLInputElement>) =>
            setCode(e.target.value);
        const handleCancel = () => {
            document.body.style.overflow = 'auto';
            setOpen(false);
        };

        return (
            <>
                <Button onClick={handleOpen}>Open</Button>

                <BookingCodeConfirmationDialog
                    open={open}
                    onClose={handleClose}
                    code={code}
                    onCodeChange={handleCodeChange}
                    onCancel={handleCancel}
                    phone="+7 985 159 49 86"
                />
            </>
        );
    };

    return <Component />;
});
