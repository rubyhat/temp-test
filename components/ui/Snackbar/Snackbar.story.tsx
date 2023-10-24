import React from 'react';
import { storiesOf } from '@storybook/react';
import Button from '@material-ui/core/Button';
import ButtonGroup from '@material-ui/core/ButtonGroup';

import SnackbarProvider from './SnackbarProvider';
import useSnackBar from './useSnackbar';
import { Snackbar } from './Snackbar';
import { Variant } from './snackbarReducer';

storiesOf('ui/Snackbar', module)
    .addDecorator(fn => <SnackbarProvider>{fn()}</SnackbarProvider>)
    .add('variants', () => {
        const Component = () => {
            const [, dispatch] = useSnackBar();
            const handleClick = (variant: Variant) =>
                dispatch({
                    type: 'show',
                    payload: {
                        message: message[variant],
                        variant,
                    },
                });

            return (
                <>
                    <ButtonGroup>
                        <Button onClick={() => handleClick('success')}>
                            Success
                        </Button>
                        <Button onClick={() => handleClick('alert')}>
                            Alert
                        </Button>
                        <Button onClick={() => handleClick('error')}>
                            Error
                        </Button>
                    </ButtonGroup>

                    <Snackbar />
                </>
            );
        };

        return <Component />;
    })
    .add('endless', () => {
        const Component = () => {
            const [, dispatch] = useSnackBar();
            const handleClick = () =>
                dispatch({
                    type: 'show',
                    payload: {
                        message: 'Endless Snackbar',
                        timeout: null,
                    },
                });

            return (
                <>
                    <Button onClick={handleClick}>Open</Button>

                    <Snackbar />
                </>
            );
        };

        return <Component />;
    })
    .add('positioned', () => {
        const Component = () => {
            const [, dispatch] = useSnackBar();
            const handleClick = () =>
                dispatch({
                    type: 'show',
                    payload: {
                        message: message.success,
                    },
                });

            return (
                <>
                    <Button onClick={handleClick}>Open</Button>

                    <Snackbar
                        anchorOrigin={{
                            vertical: 'bottom',
                            horizontal: 'right',
                        }}
                    />
                </>
            );
        };

        return <Component />;
    });

const message = {
    success: 'Успех! Вот вам зеленый статус.',
    alert: 'Что-то случилось. Мы сами не знаем что.',
    error: 'Спасите-помогите.',
};
