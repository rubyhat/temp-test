import React, { useState } from 'react';
import { storiesOf } from '@storybook/react';

import { Button } from '../ui/Button';
import { FiltersDialog, SubmitData } from './FiltersDialog';

storiesOf('FiltersDialog', module).add('default', () => {
    const Component = () => {
        const [open, setOpen] = useState(true);
        const handleClick = () => {
            setOpen(true);
        };
        const handleClose = () => {
            document.body.style.overflow = 'auto';
            setOpen(false);
        };
        const handleSubmit = (data: SubmitData) => console.log('submit', data);

        return (
            <>
                <Button
                    onClick={handleClick}
                    variant="contained"
                    color="primary"
                >
                    Open
                </Button>

                <FiltersDialog
                    open={open}
                    onClose={handleClose}
                    onSubmit={handleSubmit}
                />
            </>
        );
    };

    return <Component />;
});
