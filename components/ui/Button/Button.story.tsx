import React from 'react';
import { storiesOf } from '@storybook/react';

import { Button } from './Button';
import { Stub } from 'components/Stub/Stub';

storiesOf('ui/Button', module)
    .addDecorator(fn => <div style={{ width: 328 }}>{fn()}</div>)
    .add('primary', () => (
        <Button variant="contained" color="primary" fullWidth>
            Button
        </Button>
    ))
    .add('secondary', () => (
        <Button variant="contained" color="secondary" fullWidth>
            Button
        </Button>
    ))
    .add('outlined', () => (
        <Button variant="outlined" color="primary" fullWidth>
            Button
        </Button>
    ))
    .add('text', () => (
        <Button variant="text" color="primary" fullWidth>
            Button
        </Button>
    ))
    .add('disabled', () => (
        <Button disabled fullWidth>
            Button
        </Button>
    ))
    .add('loading', () => (
        <Button disabled fullWidth>
            <Stub absolute transparent />
            Button
        </Button>
    ))
    .add('multiline', () => (
        <Button
            title="Button"
            subtitle="Subtitle"
            variant="contained"
            color="primary"
            fullWidth
            multiline
        />
    ));
