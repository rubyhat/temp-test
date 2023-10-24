import React, { useState } from 'react';
import { storiesOf } from '@storybook/react';
import Grid from '@material-ui/core/Grid';

import { NotifyDialog } from './NotifyDialog';
import { Button } from '../ui/Button';

storiesOf('NotifyDialog', module).add('default', () => {
    const Component = () => {
        const [open, setOpen] = useState(false);
        const handleClose = () => {
            document.body.style.overflow = 'auto';
            setOpen(false);
        };
        const handleClick = () => {
            setOpen(true);
        };

        return (
            <>
                <Button
                    variant="contained"
                    color="primary"
                    onClick={handleClick}
                >
                    Open
                </Button>

                <NotifyDialog
                    open={open}
                    onClose={handleClose}
                    title="Данные устарели"
                    subtitle="Поищите заново, чтобы увидеть актуальное расписание."
                    actions={
                        <Grid container spacing={2}>
                            <Grid item xs={12} md={6}>
                                <Button
                                    variant="outlined"
                                    color="primary"
                                    fullWidth
                                >
                                    Назад к результатам
                                </Button>
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <Button
                                    variant="contained"
                                    color="secondary"
                                    fullWidth
                                >
                                    Поискать заново
                                </Button>
                            </Grid>
                        </Grid>
                    }
                />
            </>
        );
    };

    return <Component />;
});
