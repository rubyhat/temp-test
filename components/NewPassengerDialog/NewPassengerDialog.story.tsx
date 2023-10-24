import React, { useState } from 'react';
import { storiesOf } from '@storybook/react';

import { Button } from '../ui/Button';
import {
    NewPassengerDialog,
    PassengerDetailsFormData,
} from './NewPassengerDialog';
import {
    genderTypes,
    docTypes,
    bookFields,
} from '../NewPassenger/NewPassenger.story';

storiesOf('NewPassengerDialog', module)
    .add('no initial data', () => {
        const Component = () => {
            const [open, setOpen] = useState(false);
            const [data, setData] = useState<PassengerDetailsFormData | null>(
                null
            );
            const handleClick = () => {
                setOpen(true);
            };
            const handleClose = () => {
                document.body.style.overflow = 'auto';
                setOpen(false);
            };
            const handleSubmit = (data: PassengerDetailsFormData) => {
                setData(data);
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

                    <NewPassengerDialog
                        open={open}
                        onClose={handleClose}
                        onSubmit={handleSubmit}
                        title="Пассажир №1"
                        docTypes={docTypes}
                        genderTypes={genderTypes}
                        bookFields={bookFields}
                    />
                </>
            );
        };

        return <Component />;
    })
    .add('with initial data', () => {
        const Component = () => {
            const [open, setOpen] = useState(true);
            const [data, setData] = useState<PassengerDetailsFormData | null>(
                passengerDataExample
            );
            const handleClick = () => {
                setOpen(true);
            };
            const handleClose = () => {
                document.body.style.overflow = 'auto';
                setOpen(false);
            };
            const handleSubmit = (data: PassengerDetailsFormData) => {
                setData(data);
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

                    <NewPassengerDialog
                        open={open}
                        initialData={passengerDataExample}
                        onClose={handleClose}
                        onSubmit={handleSubmit}
                        title="Пассажир №2"
                        docTypes={docTypes}
                        genderTypes={genderTypes}
                        bookFields={bookFields}
                    />
                </>
            );
        };

        return <Component />;
    });

const passengerDataExample: PassengerDetailsFormData = {
    id: 1,
    lastName: 'Sanchez',
    firstName: 'Rick',
    middleName: 'Sanchezovich',
    birthDate: '1949-01-01',
    genderCode: '0',
    docTypeCode: '1',
    docNumber: 'C-137',
    citizenshipCode: 'RU',
};
