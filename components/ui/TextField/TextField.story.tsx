import React from 'react';
import CancelIcon from '@material-ui/icons/Cancel';
import Card from '@material-ui/core/Card';
import InputAdornment from '@material-ui/core/InputAdornment';
import { storiesOf } from '@storybook/react';

import { TextField } from './TextField';

storiesOf('ui/TextField', module)
    .add('primary', () => <TextField placeholder="Primary" color="primary" />)
    .add('secondary', () => (
        <TextField placeholder="Secondary" color="secondary" />
    ))
    .add('labeled', () => <TextField label="Labeled" />)
    .add('outlined', () => (
        <TextField placeholder="Outlined" variant="outlined" />
    ))
    .add('icon', () => (
        <TextField
            placeholder="Icon"
            InputProps={{
                endAdornment: (
                    <InputAdornment position="end">
                        <CancelIcon
                            style={{
                                fontSize: '18px',
                                color: 'rgba(8, 41, 59, 0.38)',
                            }}
                        />
                    </InputAdornment>
                ),
            }}
        />
    ))
    .add('naked', () => (
        <Card style={{ padding: '8px 16px' }}>
            <TextField
                placeholder="Naked"
                InputProps={{
                    disableUnderline: true,
                }}
            />
        </Card>
    ))
    .add('filled', () => (
        <Card>
            <TextField
                label="Filled"
                variant="filled"
                InputProps={{
                    disableUnderline: true,
                }}
            />
        </Card>
    ));
