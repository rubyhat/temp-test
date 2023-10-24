import React, { FC, ReactNode } from 'react';
import Divider from '@material-ui/core/Divider';
import ListItem from '@material-ui/core/ListItem';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import ListItemText from '@material-ui/core/ListItemText';
import clsx from 'clsx';
import { makeStyles, Theme } from '@material-ui/core/styles';

import { BusDto } from 'swagger/client';
import { List } from 'components/ui/List/List';
import { Typo } from '../Typo/Typo';
import { formatBusColor, formatBusName } from 'utils/ride';
import { useTranslation } from 'i18n';
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
    { name: 'DesktopOrderBusDetailsCard' }
);

type Props = {
    bus: BusDto;
    className?: string;
    children?: ReactNode;
};

export const DesktopOrderBusDetailsCard: FC<Props> = props => {
    const { bus, className, children } = props;
    const classes = useStyles();
    const { t } = useTranslation();

    return (
        <div className={clsx(classes.root, className)}>
            {children ? (
                <div className={classes.children}>{children}</div>
            ) : null}

            <List>
                <ListItem>
                    <ListItemText
                        primary={
                            <Typo color="textSecondary">
                                {t('order:transport')}
                            </Typo>
                        }
                    />

                    <ListItemSecondaryAction>
                        <ListItemText
                            primary={
                                <Typo color="textPrimary">
                                    {formatBusName(bus)}
                                </Typo>
                            }
                        />
                    </ListItemSecondaryAction>
                </ListItem>

                <Divider variant="middle" />

                {bus.color ? (
                    <>
                        <ListItem>
                            <ListItemText
                                primary={
                                    <Typo color="textSecondary">
                                        {t('order:color')}
                                    </Typo>
                                }
                            />

                            <ListItemSecondaryAction>
                                <ListItemText
                                    primary={
                                        <Typo color="textPrimary">
                                            {formatBusColor(bus.color)}
                                        </Typo>
                                    }
                                />
                            </ListItemSecondaryAction>
                        </ListItem>
                        <Divider variant="middle" />
                    </>
                ) : null}

                {bus.reg ? (
                    <ListItem>
                        <ListItemText
                            primary={
                                <Typo color="textSecondary">
                                    {t('order:busReg')}
                                </Typo>
                            }
                        />

                        <ListItemSecondaryAction>
                            <ListItemText
                                primary={
                                    <Typo color="textPrimary">{bus.reg}</Typo>
                                }
                            />
                        </ListItemSecondaryAction>
                    </ListItem>
                ) : null}
            </List>
        </div>
    );
};
