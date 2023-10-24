import React from 'react';
import { storiesOf } from '@storybook/react';

import { DesktopNewPassenger } from './DesktopNewPassenger';
import {
    genderTypes,
    docTypes,
    bookFields,
    ticketTypes,
} from '../NewPassenger/NewPassenger.story';
import { PassengerFormData } from '../NewPassenger';
import { documents } from '../DocumentSelect/DocumentSelect.story';

storiesOf('DesktopNewPassenger', module).add('default', () => {
    const Component = () => {
        const handleSubmit = (passenger: PassengerFormData | null) => {
            console.log('passenger', passenger);
        };

        return (
            <DesktopNewPassenger
                title="Пассажир №1"
                ticketTypes={ticketTypes[0]}
                docTypes={docTypes}
                genderTypes={genderTypes}
                onSubmit={handleSubmit}
                currency="RUB"
                bookFields={[...bookFields, 'patronymic', 'citizenship']}
                documents={documents}
            />
        );
    };

    return <Component />;
});
