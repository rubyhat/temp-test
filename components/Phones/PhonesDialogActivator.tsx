import React, { FC, useState } from 'react';
import IconButton from '@material-ui/core/IconButton';
import PhoneIcon from '@material-ui/icons/Phone';
import { makeStyles, Theme } from '@material-ui/core/styles';

import { PhonesDialog } from './PhonesDialog';

const useStyles = makeStyles(
    (theme: Theme) => ({
        /* Styles applied to the root element. */
        root: {},
    }),
    { name: 'PhonesDialogActivator' }
);

type Props = {
    phones: string[];
};

export const PhonesDialogActivator: FC<Props> = props => {
    const { phones } = props;
    const classes = useStyles();
    const [open, setOpen] = useState(false);

    const handleOpen = () => {
        setOpen(true);
    };
    const handleClose = () => {
        document.body.style.overflow = 'auto';
        setOpen(false);
    };

    return (
        <div className={classes.root}>
            <IconButton onClick={handleOpen} color="primary" edge="end">
                <PhoneIcon />
            </IconButton>

            <PhonesDialog open={open} onClose={handleClose} phones={phones} />
        </div>
    );
};
