import React, { FC } from 'react';
import { makeStyles, Theme } from '@material-ui/core/styles';

import { Button } from '../ui/Button';
import { List } from '../ui/List/List';
import { ListSubheader } from '../ui/ListSubheader';
import { MobileDialog } from '../ui/MobileDialog';
import { PassengerDocument } from '../PassengerDocument';
import { PersonalDataDto } from 'swagger/client';
import { useTranslation } from 'i18n';

const useStyles = makeStyles(
    (theme: Theme) => ({
        /* Styles applied to the root element. */
        root: {},
        /* Styles applied to the container `div` element. */
        container: {
            marginTop: theme.spacing(2),
            // marginBottom: 16,
        },
        /* Styles applied to the action `div` element. */
        action: {
            backgroundColor: '#FFF',
            padding: theme.spacing(2),
        },
        /* Styles applied to the `List` component. */
        list: {},
        /* Styles applied to the `PassengerDocument` component. */
        document: {
            '& ~ &': {
                marginTop: theme.spacing(2),
            },
        },
    }),
    { name: 'SavedPassengersDialog' }
);

type Props = {
    title: string;
    documents: PersonalDataDto[];
    open: boolean;
    onClose: () => void;
    onNewPassenger: () => void;
    onSelectPassenger: (passenger: PersonalDataDto) => void;
};

export const SavedPassengersDialog: FC<Props> = props => {
    const {
        title,
        documents,
        open,
        onClose,
        onNewPassenger,
        onSelectPassenger,
    } = props;
    const classes = useStyles();
    const { t } = useTranslation();

    const handleNewPassenger = () => onNewPassenger();
    const handleSelectPassenger = (doc: PersonalDataDto) =>
        onSelectPassenger(doc);

    return (
        <MobileDialog
            open={open}
            onClose={onClose}
            title={title}
            textCenter
            startIcon="close"
        >
            <div className={classes.container}>
                <div className={classes.action}>
                    <Button
                        variant="outlined"
                        color="primary"
                        fullWidth
                        onClick={handleNewPassenger}
                    >
                        {t('booking:addNewPassenger')}
                    </Button>
                </div>

                <List
                    className={classes.list}
                    subheader={
                        <ListSubheader>
                            {t('booking:savedPassengers')}
                        </ListSubheader>
                    }
                    disablePadding
                >
                    {documents.map((doc, i) => (
                        <PassengerDocument
                            className={classes.document}
                            key={i}
                            doc={doc}
                            onClick={handleSelectPassenger}
                        />
                    ))}
                </List>
            </div>
        </MobileDialog>
    );
};
