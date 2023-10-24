import React from 'react';
import { storiesOf } from '@storybook/react';

import { Fab } from './Fab';
import MyLocationIcon from '@material-ui/icons/MyLocation';

storiesOf('ui/Fab', module)
    .add('default', () => <Fab variant="extended">Button</Fab>)
    .add('text icon', () => (
        <Fab variant="extended">
            <MyLocationIcon style={{ marginRight: 8 }} fontSize="small" />
            Button
        </Fab>
    ))
    .add('only icon', () => (
        <Fab>
            <MyLocationIcon fontSize="small" />
        </Fab>
    ))
    .add('disabled', () => (
        <Fab variant="extended" disabled>
            <MyLocationIcon style={{ marginRight: 8 }} fontSize="small" />
            Button
        </Fab>
    ));
