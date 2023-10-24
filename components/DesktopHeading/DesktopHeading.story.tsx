import React from 'react';
import { storiesOf } from '@storybook/react';

import { DesktopHeading } from './DesktopHeading';

storiesOf('DesktopHeading', module).add('default', () => (
    <DesktopHeading
        pageTitle="Оплата"
        backUrl="/search"
        breadcrumbTitle="Назад в поиск"
    />
));
