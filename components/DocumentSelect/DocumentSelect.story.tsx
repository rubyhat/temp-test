import React from 'react';
import { storiesOf } from '@storybook/react';

import { DocumentSelect } from './DocumentSelect';
import { PersonalDataDto } from 'swagger/client';

storiesOf('DocumentSelect', module).add('default', () => (
    <DocumentSelect documents={documents} />
));

export const documents: PersonalDataDto[] = [
    {
        id: 48,
        name: 'Rick',
        surname: 'Sanchez',
    },
    {
        id: 49,
        name: 'Jon',
        surname: 'Snow',
        patronymic: 'Эддардович',
        gender: 'M',
        docType: 'id_ru',
        docNum: '4611770735',
        citizen: 'RU',
        birthday: '1992-04-16',
    },
    {
        id: 50,
        name: 'Victor',
        surname: 'Vlas',
    },
    {
        id: 51,
        name: 'Иван',
        surname: 'Иванов',
        patronymic: 'Иванович',
        gender: 'M',
        docType: 'id_ru',
        docNum: '4621770734',
        citizen: 'RU',
        birthday: '1993-08-19',
    },
    {
        id: 52,
        name: 'Иван',
        surname: 'Иванов',
        patronymic: 'Иванович',
        gender: 'M',
        docType: 'id_ru',
        docNum: '4621770735',
        citizen: 'RU',
        birthday: '1993-08-18',
    },
];
