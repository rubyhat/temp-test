import React, { useState } from 'react';
import { storiesOf } from '@storybook/react';

import { AdditionalService } from '../AdditionalServices';
import { additionalServices } from '../AdditionalServices/AdditionalServices.story';
import { AdditionalServicesDialog } from './AdditionalServicesDialog';
import { Button } from '../ui/Button';

storiesOf('AdditionalServicesDialog', module).add('default', () => {
    const Component = () => {
        const [open, setOpen] = useState(false);
        const handleClick = () => {
            setOpen(true);
        };
        const handleClose = () => {
            document.body.style.overflow = 'auto';
            setOpen(false);
        };
        const handleSelect = (service: AdditionalService) => {
            document.body.style.overflow = 'auto';
            setOpen(false);
        };

        return (
            <>
                <Button
                    onClick={handleClick}
                    variant="contained"
                    color="primary"
                >
                    Open
                </Button>

                <AdditionalServicesDialog
                    open={open}
                    onClose={handleClose}
                    onSelect={handleSelect}
                    title="Выберите услугу"
                    additionalServices={additionalServices}
                />
            </>
        );
    };

    return <Component />;
});
