import React from 'react';
import { storiesOf } from '@storybook/react';

import {
    genderTypes,
    ticketTypes,
    docTypes,
    bookFields,
} from '../NewPassenger/NewPassenger.story';
import { NewPassengerStep } from './NewPassengerStep';
import { ActionBar } from '../ActionBar';
import { Button } from '../ui/Button';

storiesOf('NewPassengerStep', module)
    .add('default', () => {
        const Component = () => {
            return (
                <NewPassengerStep
                    ticketTypes={ticketTypes}
                    docTypes={docTypes}
                    genderTypes={genderTypes}
                    bookFields={bookFields}
                    passengersNumber={1}
                    currency="RUB"
                    action={
                        <ActionBar>
                            <Button
                                variant="contained"
                                color="primary"
                                fullWidth
                                title="Продолжить"
                            />
                        </ActionBar>
                    }
                />
            );
        };

        return <Component />;
    });
