import React from 'react';
import { storiesOf } from '@storybook/react';

import { RideBenefitsList } from './RideBenefitsList';
import { SearchDtoBenefitsEnum } from 'swagger/client';

storiesOf('RideBenefitsList', module).add('default', () => (
    <RideBenefitsList title="Удобства" items={benefits} />
));

export const benefits: SearchDtoBenefitsEnum[] = [
    SearchDtoBenefitsEnum.Tv,
    SearchDtoBenefitsEnum.Wifi,
    SearchDtoBenefitsEnum._220v,
];
