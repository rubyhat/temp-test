import React from 'react';
import Button from '@material-ui/core/Button';
import { storiesOf } from '@storybook/react';

import { Tooltip } from './Tooltip';

storiesOf('ui/Tooltip', module)
    .add('on hover', () => (
        <Tooltip title="Tooltip title" color="primary">
            <Button color="primary" variant="outlined">
                Hover
            </Button>
        </Tooltip>
    ))
    .add('force open', () => (
        <Tooltip title="Tooltip title" color="primary" open={true}>
            <Button color="primary" variant="outlined">
                Force open
            </Button>
        </Tooltip>
    ));
