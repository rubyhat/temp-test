import React, { FC } from 'react';
import CloseIcon from '@material-ui/icons/Close';
import Divider from '@material-ui/core/Divider';
import IconButton from '@material-ui/core/IconButton';
import { makeStyles, Theme } from '@material-ui/core/styles';

import { AppBar } from '../AppBar';
import { Button } from '../ui/Button';
import { ResponsiveDialog } from '../ui/ResponsiveDialog';
import { formatPhone, tel } from 'utils/phone';
import { useTranslation } from 'i18n';
import { useCountry } from 'hooks/useCountry';

const useStyles = makeStyles(
    (theme: Theme) => ({
        /* Styles applied to the root element. */
        root: {},
        header: {
            padding: theme.spacing(2),
            position: 'relative',
        },
        iconClose: {
            position: 'absolute',
            top: 0,
            right: 0,
        },
        body: {
            padding: theme.spacing(2),
        },
        buttonPhone: {
            '& ~ &': {
                marginTop: theme.spacing(2),
            },
        },
    }),
    { name: 'PhonesDialog' }
);

type Props = {
    open: boolean;
    onClose: () => void;
    phones: string[];
};

export const PhonesDialog: FC<Props> = props => {
    const { open, onClose, phones } = props;
    const classes = useStyles();
    const { t } = useTranslation();
    const { country } = useCountry();

    return (
        <ResponsiveDialog
            open={open}
            onClose={onClose}
            position="center"
            fullScreen={false}
            fullWidth={true}
        >
            <AppBar
                title={t('phonesDialogTitle', {
                    context: country,
                })}
                disableBackIcon
                endIcon={
                    <IconButton color="primary" edge="end" onClick={onClose}>
                        <CloseIcon />
                    </IconButton>
                }
            />

            <Divider />

            <div
                className={classes.body}
                itemScope
                itemType="http://schema.org/ContactPoint"
            >
                {phones.map(phone => {
                    const formattedPhone = formatPhone(phone);

                    return (
                        <Button
                            className={classes.buttonPhone}
                            key={phone}
                            color="primary"
                            variant="contained"
                            fullWidth
                            href={`tel:${tel(formattedPhone)}`}
                            itemProp="telephone"
                        >
                            {formattedPhone}
                        </Button>
                    );
                })}
            </div>
        </ResponsiveDialog>
    );
};
