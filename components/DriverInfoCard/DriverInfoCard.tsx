import React from 'react';
import clsx from 'clsx';
import { formatPhone, tel } from 'utils/phone';

import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import Divider from '@material-ui/core/Divider';
import { makeStyles, Theme } from '@material-ui/core/styles';

import { DriverDto } from 'swagger/client';
import { useTranslation } from 'i18n';

import { Typo } from '../Typo/Typo';
import { List } from 'components/ui/List/List';
import { AtlasTheme } from 'typings/atlas-theme';

const useStyles = makeStyles(
    (theme: Theme & AtlasTheme) => ({
        /* Styles applied to the root element. */
        root: {
            borderRadius: theme.shape.borderRadius,
            boxShadow: theme.atlas.shadows.bottom,
            backgroundColor: '#FFF',
        },
        /* Styles applied to the children `div` element. */
        children: {
            padding: theme.spacing(2, 2, 0),
        },
    }),
    { name: 'DriverInfoCard' }
);

type Props = {
    className: string;
    driver: DriverDto;
};

const DriverInfoCard = ({ className, driver }: Props) => {
    const { phone, name } = driver;
    const classes = useStyles();
    const { t } = useTranslation();
    let formattedPhone = null;
    if (phone) {
        formattedPhone = formatPhone(phone);
    }
    return (
        <div className={clsx(classes.root, className)}>
            <List>
                {name && (
                    <ListItem>
                        <ListItemText
                            primary={
                                <Typo color="textSecondary">
                                    {t('order:driver')}
                                </Typo>
                            }
                        />

                        <ListItemSecondaryAction>
                            <ListItemText
                                primary={
                                    <Typo color="textPrimary">{name}</Typo>
                                }
                            />
                        </ListItemSecondaryAction>
                    </ListItem>
                )}
                {name && formattedPhone && <Divider variant="middle" />}
                {formattedPhone && (
                    <ListItem>
                        <ListItemText
                            primary={
                                <Typo color="textSecondary">
                                    {t('order:phoneDriver')}
                                </Typo>
                            }
                        />

                        <ListItemSecondaryAction>
                            <ListItemText
                                primary={
                                    <Typo color="textPrimary">
                                        <a href={`tel:${tel(formattedPhone)}`}>
                                            {formattedPhone}
                                        </a>
                                    </Typo>
                                }
                            />
                        </ListItemSecondaryAction>
                    </ListItem>
                )}
            </List>
        </div>
    );
};

export default DriverInfoCard;
