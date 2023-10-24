import React, { FC } from 'react';
import ListItem from '@material-ui/core/ListItem';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import ListItemText from '@material-ui/core/ListItemText';
import clsx from 'clsx';
import { makeStyles, Theme } from '@material-ui/core/styles';

import { List } from '../ui/List/List';
import { Typo } from '../Typo/Typo';
import { useTranslation } from 'i18n';
import { tel } from 'utils/phone';

const useStyles = makeStyles(
    (theme: Theme) => ({
        /* Styles applied to the root element. */
        root: {},
        phoneLink: {
            color: theme.palette.primary.main,
        },
    }),
    { name: 'ContactPhoneList' }
);

type Props = {
    phone: string;
    formattedPhone: string;
    className?: string;
};

export const ContactPhoneList: FC<Props> = props => {
    const { phone, formattedPhone, className } = props;
    const classes = useStyles();
    const { t } = useTranslation();

    return (
        <List className={clsx(classes.root, className)}>
            <ListItem>
                <ListItemText
                    primary={
                        <Typo color="textSecondary">{t('contactPhone')}</Typo>
                    }
                />
                <ListItemSecondaryAction>
                    <ListItemText
                        primary={
                            <Typo color="textPrimary">
                                <a
                                    className={classes.phoneLink}
                                    href={`tel:${tel(formattedPhone)}`}
                                >
                                    {formattedPhone}
                                </a>
                            </Typo>
                        }
                    />
                </ListItemSecondaryAction>
            </ListItem>
        </List>
    );
};
