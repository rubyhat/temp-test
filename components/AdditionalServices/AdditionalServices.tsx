import React, { FC, useState } from 'react';
import { makeStyles, Theme } from '@material-ui/core/styles';
import ListItem from '@material-ui/core/ListItem';
import Divider from '@material-ui/core/Divider';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import CancelIcon from '@material-ui/icons/Cancel';

import { List } from '../ui/List/List';
import { Typo } from '../Typo/Typo';
import { Button } from '../ui/Button';
import { AdditionalServicesDialog } from '../AdditionalServicesDialog';
import { AtlasTheme } from 'typings/atlas-theme';

const useStyles = makeStyles(
    (theme: Theme & AtlasTheme) => ({
        /* Styles applied to the root element. */
        root: {
            padding: theme.spacing(2),
        },
        itemAction: {
            display: 'flex',
            alignItems: 'center',
        },
        cancelIcon: {
            marginLeft: theme.spacing(1),
        },
        passengerName: {
            fontSize: theme.atlas.typography.body1.fontSize,
            color: theme.atlas.palette.text.base,
            fontWeight: 700,
            marginBottom: theme.spacing(2),
        },
        /* Styles applied to the Button component. */
        button: {
            marginTop: theme.spacing(2),
        },
        listItemSecondaryAction: {
            right: 0,
        },
    }),
    { name: 'AdditionalServices' }
);

export type AdditionalService = {
    id: string;
    name: string;
    price: number | 'free' | 'included';
};

type Props = {
    passengerName: string;
    additionalServices: AdditionalService[];
    selectedServices: AdditionalService[];
    onChange: (data: AdditionalService[]) => void;
};

export const AdditionalServices: FC<Props> = props => {
    const {
        additionalServices,
        selectedServices,
        passengerName,
        onChange,
    } = props;
    const classes = useStyles();

    const [open, setOpen] = useState(false);
    const handleClick = () => {
        document.body.style.overflow = 'hidden';
        setOpen(true);
    };
    const handleClose = () => {
        document.body.style.overflow = 'auto';
        setOpen(false);
    };
    const handleSelect = (service: AdditionalService) => {
        console.log('handle select', service);
        onChange([...selectedServices, { ...service }]);
        document.body.style.overflow = 'auto';
        setOpen(false);
    };
    const handleClear = (service: AdditionalService) => () => {
        const clearIndex = selectedServices.findIndex(
            selectedService => selectedService === service
        );

        onChange(
            selectedServices.filter((service, index) => index !== clearIndex)
        );
    };

    const renderPriceText = (price: AdditionalService['price']) => {
        if (price === 'included') {
            return 'Включено';
        } else if (price === 'free') {
            return 'Бесплатно';
        } else {
            return `${price} ₽`;
        }
    };

    const renderAdditionalServices = () => {
        return selectedServices.map((service, index) => (
            <React.Fragment key={service.name}>
                <ListItem disableGutters>
                    <ListItemText
                        primary={
                            <Typo variant="body1" color="textPrimary">
                                {service.name}
                            </Typo>
                        }
                    />
                    <ListItemSecondaryAction
                        className={classes.listItemSecondaryAction}
                    >
                        <div className={classes.itemAction}>
                            <Typo variant="body1" color="textSecondary">
                                {renderPriceText(service.price)}
                            </Typo>
                            {service.price !== 'included' && (
                                <CancelIcon
                                    onClick={handleClear(service)}
                                    className={classes.cancelIcon}
                                    color="primary"
                                />
                            )}
                        </div>
                    </ListItemSecondaryAction>
                </ListItem>
                {index + 1 < selectedServices.length && (
                    <Divider component="li" />
                )}
            </React.Fragment>
        ));
    };

    return (
        <div className={classes.root}>
            <div className={classes.passengerName}>{passengerName}</div>
            <List disablePadding>{renderAdditionalServices()}</List>
            <Button
                className={classes.button}
                variant="outlined"
                color="primary"
                fullWidth
                onClick={handleClick}
            >
                Добавить услугу
            </Button>

            <AdditionalServicesDialog
                open={open}
                onClose={handleClose}
                onSelect={handleSelect}
                title={'Выберите услугу'}
                additionalServices={additionalServices}
            />
        </div>
    );
};
