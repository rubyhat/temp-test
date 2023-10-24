import React, { FC } from 'react';
import Divider from '@material-ui/core/Divider';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import { makeStyles, Theme } from '@material-ui/core/styles';

import { AdditionalService } from '../AdditionalServices';
import { List } from '../ui/List/List';
import { MobileDialog } from '../ui/MobileDialog';
import { Typo } from '../Typo/Typo';

const useStyles = makeStyles((theme: Theme) => ({
    /* Styles applied to the root element. */
    root: {
        padding: theme.spacing(2),
    },
    /* Styles applied to the List component. */
    list: {
        backgroundColor: '#FFF',
    },
}));

type Props = {
    open: boolean;
    onClose: () => void;
    onSelect: (service: AdditionalService) => void;
    title: string;
    additionalServices: AdditionalService[];
};

export const AdditionalServicesDialog: FC<Props> = props => {
    const { title, additionalServices, open, onClose, onSelect } = props;
    const classes = useStyles();

    const handleListItemClick = (service: AdditionalService) => () =>
        onSelect(service);

    return (
        <MobileDialog open={open} onClose={onClose} title={title} textCenter>
            <List className={classes.list}>
                {additionalServices.map((service, index) => (
                    <React.Fragment key={index}>
                        <ListItem onClick={handleListItemClick(service)} button>
                            <ListItemText
                                primary={
                                    <Typo variant="body1" color="textPrimary">
                                        {service.name}
                                    </Typo>
                                }
                            />
                        </ListItem>
                        {index + 1 < additionalServices.length && (
                            <Divider component="li" variant="middle" />
                        )}
                    </React.Fragment>
                ))}
            </List>
        </MobileDialog>
    );
};
