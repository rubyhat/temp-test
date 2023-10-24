import React, { useState } from 'react';
import { storiesOf } from '@storybook/react';
import ConfirmationNumberIcon from '@material-ui/icons/ConfirmationNumber';
import DateRangeIcon from '@material-ui/icons/DateRange';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import HelpIcon from '@material-ui/icons/Help';
import SearchIcon from '@material-ui/icons/Search';

import { MobileBottomNavigation } from './MobileBottomNavigation';

storiesOf('MobileBottomNavigation', module)
    .add('default', () => {
        const Component = () => {
            const [value, setValue] = useState('/');
            const handleChange = (value: string) => setValue(value);

            return (
                <MobileBottomNavigation
                    value={value}
                    onChange={handleChange}
                    items={items}
                />
            );
        };

        return <Component />;
    });

const items = [
    {
        pathname: '/',
        label: 'Поиск',
        iconComponent: <SearchIcon />,
    },
    {
        pathname: '/help',
        label: 'Помощь',
        iconComponent: <HelpIcon />,
    },
    {
        pathname: '/timetable',
        label: 'Расписание',
        iconComponent: <DateRangeIcon />,
    },
    {
        pathname: '/trips',
        label: 'Поездки',
        iconComponent: <ConfirmationNumberIcon />,
    },
    {
        pathname: '/login',
        label: 'Войти',
        iconComponent: <ExitToAppIcon />,
    },
];
