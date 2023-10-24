import React, { useState } from 'react';
import { storiesOf } from '@storybook/react';
import DialogActions from '@material-ui/core/DialogActions';
import CloseIcon from '@material-ui/icons/Close';
import IconButton from '@material-ui/core/IconButton';
import Box from '@material-ui/core/Box';

import { AppBar } from 'components/AppBar';
import { Button } from 'components/ui/Button';
import { Typo } from 'components/Typo/Typo';
import { ResponsiveDialog } from './ResponsiveDialog';

storiesOf('ui/ResponsiveDialog', module)
    .add('default', () => (
        <ResponsiveDialog open={true}>
            <Box padding={'16px'}>Only content</Box>
        </ResponsiveDialog>
    ))
    .add('full height', () => (
        <ResponsiveDialog open={true} height="100%">
            <Box padding={'16px'}>Full height on small devices</Box>
        </ResponsiveDialog>
    ))
    .add('80vh', () => (
        <ResponsiveDialog open={true} height="80vh">
            <Box padding={'16px'}>80vh on small devices</Box>
        </ResponsiveDialog>
    ))
    .add('with Bar', () => {
        const Component = () => {
            const [open, setOpen] = useState(false);
            const handleClose = () => setOpen(false);
            const handleOpen = () => setOpen(true);

            return (
                <>
                    <Button
                        color="primary"
                        variant="contained"
                        onClick={handleOpen}
                    >
                        Open dialog
                    </Button>

                    <ResponsiveDialog
                        BarComponent={
                            <AppBar
                                title="Пересадка"
                                disableBackIcon
                                textCenter
                                endIcon={
                                    <IconButton
                                        edge="end"
                                        color="primary"
                                        onClick={handleClose}
                                    >
                                        <CloseIcon />
                                    </IconButton>
                                }
                            />
                        }
                        open={open}
                        onClose={handleClose}
                    >
                        <Box padding={'16px'}>
                            <Typo variant="subtitle" weight="bold" paragraph>
                                Пересадка в Тула, Автовокзал
                            </Typo>
                            <Typo variant="body1" color="textSecondary">
                                Прибытие в 09:20, Отправление в 10:10
                            </Typo>
                        </Box>
                        <DialogActions>
                            <Button onClick={handleClose} color="primary">
                                Нет
                            </Button>
                            <Button onClick={handleClose} color="primary">
                                Да
                            </Button>
                        </DialogActions>
                    </ResponsiveDialog>
                </>
            );
        };

        return <Component />;
    });
