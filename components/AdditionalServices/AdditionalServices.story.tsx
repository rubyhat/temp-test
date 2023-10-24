import React, { useState } from 'react';
import { storiesOf } from '@storybook/react';

import { AdditionalServices, AdditionalService } from './AdditionalServices';

storiesOf('AdditionalServices', module)
    .add('default', () => {
        const [selectedServices, setSelectedServices] = useState<
            AdditionalService[]
        >([additionalServices[0]]);
        const handleChange = (data: AdditionalService[]) =>
            setSelectedServices(data);

        const Component = () => {
            return (
                <AdditionalServices
                    passengerName="Константинов Иван Иванович"
                    additionalServices={additionalServices}
                    selectedServices={selectedServices}
                    onChange={handleChange}
                />
            );
        };

        return <Component />;
    });

export const additionalServices: AdditionalService[] = [
    { id: '1', name: 'Багаж (20×40×55см · 23 кг)', price: 'included' },
    { id: '2', name: 'Багаж (20×40×55см · 23 кг)', price: 500 },
    { id: '3', name: 'Детское кресло', price: 'free' },
];
