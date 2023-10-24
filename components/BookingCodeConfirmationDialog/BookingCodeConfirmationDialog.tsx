import React, { FC, ChangeEvent } from 'react';
import { makeStyles, Theme } from '@material-ui/core/styles';

import { Button } from '../ui/Button';
import { ResponsiveDialog } from '../ui/ResponsiveDialog';
import { TextField } from '../ui/TextField/TextField';
import { Typo } from '../Typo/Typo';

const useStyles = makeStyles(
    (theme: Theme) => ({
        /* Styles applied to the root element. */
        root: {
            padding: '24px 16px',
            textAlign: 'center',
            [theme.breakpoints.up('sm')]: {
                padding: 24,
            },
        },
        /* Styles applied to the title `Typo` component. */
        title: {
            marginBottom: theme.spacing(1),
        },
        /* Styles applied to the code `TextField` component. */
        codeTextField: {
            marginTop: theme.spacing(2),
        },
        /* Styles applied to the cancel `Button` component. */
        cancelButton: {
            marginTop: theme.spacing(4),
        },
    }),
    { name: 'BookingCodeConfirmationDialog' }
);

type Props = {
    open: boolean;
    onClose: () => void;
    code: string;
    onCodeChange: (e: ChangeEvent<HTMLInputElement>) => void;
    onCancel: () => void;
    phone: string;
};

export const BookingCodeConfirmationDialog: FC<Props> = props => {
    const { open, code, phone, onClose, onCancel, onCodeChange } = props;
    const classes = useStyles();

    return (
        <ResponsiveDialog
            open={open}
            onClose={onClose}
            position="center"
            fullScreen={false}
            fullWidth={true}
        >
            <div className={classes.root}>
                <Typo
                    variant="subtitle"
                    weight="bold"
                    component="div"
                    className={classes.title}
                >
                    Осталось ещё немного
                </Typo>
                <Typo variant="body1" component="div">
                    Подтвердите ваш номер, чтобы завершить бронирование и
                    сохранить свой телефон в личном кабинете
                    <Typo weight="bold" component="div">
                        {phone}
                    </Typo>
                </Typo>

                <TextField
                    value={code}
                    onChange={onCodeChange}
                    label="Введите код из SMS"
                    type="number"
                    fullWidth
                    className={classes.codeTextField}
                />

                <Button
                    onClick={onCancel}
                    className={classes.cancelButton}
                    variant="outlined"
                    color="primary"
                    fullWidth
                >
                    Отмена
                </Button>
            </div>
        </ResponsiveDialog>
    );
};
