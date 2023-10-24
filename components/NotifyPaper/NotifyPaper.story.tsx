import React from 'react';
import { storiesOf } from '@storybook/react';

import { Button } from '../ui/Button';
import { NotifyPaper } from './NotifyPaper';

storiesOf('NotifyPaper', module)
    .add('default', () => (
        <NotifyPaper
            title="Что-то пошло не так"
            subtitle="Возможно что-то сломалось. Попробуйте поискать заново."
            actions={
                <Button variant="outlined" color="primary" fullWidth>
                    Искать заново
                </Button>
            }
        />
    ))
    .add('no action', () => (
        <NotifyPaper
            title="Рейсов не найдено"
            subtitle="Попробуйте изменить точки маршрута или настройки фильтров."
        />
    ));
