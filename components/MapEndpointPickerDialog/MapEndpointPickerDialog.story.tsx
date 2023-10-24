import React, { useState } from 'react';
import { storiesOf } from '@storybook/react';

import { Button } from '../ui/Button';
import { endpoints } from '../MapEndpointPicker/MapEndpointPicker.story';
import { MapEndpointPickerDialog } from './MapEndpointPickerDialog';
import { StopsDto } from 'swagger/client';

storiesOf('MapEndpointPickerDialog', module).add('default', () => {
    const Component = () => {
        const [open, setOpen] = useState(false);
        const [value, setValue] = useState<string | null>(null);

        const handleClick = () => {
            setOpen(true);
        };
        const handleClose = () => {
            document.body.style.overflow = 'auto';
            setOpen(false);
        };
        const handleChange = (id: StopsDto['id'] | null) => setValue(id);
        const handleAccept = (id: StopsDto['id']) => {
            console.log('onAccept', id);
            document.body.style.overflow = 'auto';
            setOpen(false);
        };

        return (
            <>
                <Button onClick={handleClick}>Open</Button>

                <MapEndpointPickerDialog
                    value={value}
                    endpoints={endpoints}
                    open={open}
                    onClose={handleClose}
                    onChange={handleChange}
                    onAccept={handleAccept}
                    title="Выберите место посадки"
                    defaultLatitude={53.900559}
                    defaultLongitude={27.558895}
                />
            </>
        );
    };

    return <Component />;
});
