import React from 'react';
import { storiesOf } from '@storybook/react';

import { Button } from '../ui/Button';
import { ActionBar } from './ActionBar';

storiesOf('ActionBar', module)
    .add('position static', () => (
        <ActionBar position="static">
            <Button
                variant="contained"
                color="primary"
                fullWidth
                title="500 ₽ за 1 место"
                subtitle="Свободно 5+ мест"
            />
        </ActionBar>
    ))
    .add('position fixed', () => (
        <ActionBar position="fixed">
            <Button
                variant="contained"
                color="secondary"
                fullWidth
                title="500 ₽ за 1 место"
                subtitle="Свободно 5+ мест"
            />
        </ActionBar>
    ));
