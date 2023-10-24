import React from 'react';
import { storiesOf } from '@storybook/react';
import IconButton from '@material-ui/core/IconButton';
import MoreVertIcon from '@material-ui/icons/MoreVert';

import { AppBar } from './AppBar';

storiesOf('AppBar', module)
    .add('title', () => <AppBar title="Выберите место посадки" textCenter />)
    .add('subtitle', () => (
        <AppBar title="Москва – Санкт-Петербург" subtitle="15 мая, Ср" />
    ))
    .add('center text', () => (
        <AppBar
            title="Москва – Санкт-Петербург"
            subtitle="15 мая, Ср"
            textCenter
        />
    ))
    .add('no back icon', () => (
        <AppBar
            title="Москва – Санкт-Петербург"
            subtitle="15 мая, Ср"
            disableBackIcon
        />
    ))
    .add('end icon', () => (
        <AppBar
            title="Москва – Санкт-Петербург"
            subtitle="15 мая, Ср · 3 человека"
            endIcon={
                <IconButton edge="end">
                    <MoreVertIcon color="primary" />
                </IconButton>
            }
            textCenter
        />
    ));
