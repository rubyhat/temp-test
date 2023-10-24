import React, { FC } from 'react';
import ListItem from '@material-ui/core/ListItem/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText/ListItemText';
import Tooltip from '@material-ui/core/Tooltip';
import camelCase from 'lodash/camelCase';
import clsx from 'clsx';
import upperFirst from 'lodash/upperFirst';
import { makeStyles, Theme } from '@material-ui/core/styles';

import { List } from 'components/ui/List/List';
import { SearchDtoBenefitsEnum } from 'swagger/client';
import { benefitsIconsMap } from 'utils/benefits';
import { useTranslation } from 'i18n';
import { AtlasTheme } from 'typings/atlas-theme';

const useStyles = makeStyles(
    (theme: Theme & AtlasTheme) => ({
        /* Styles applied to the root element. */
        root: {},
        icons: {
            whiteSpace: 'nowrap',
        },
        icon: {
            '& ~ &': {
                marginLeft: theme.spacing(2),
            },
        },
        benefits: {},
        /* Styles applied to the `ListItem` component. */
        listItem: {
            paddingTop: theme.spacing(0.5),
            paddingBottom: theme.spacing(0.5),
        },
        /* Styles applied to the `ListItemIcon` component. */
        listItemIcon: {
            minWidth: 48,
        },
        /* Styles applied to the `ListItemText` component. */
        listItemText: {
            color: theme.atlas.palette.text.minor,
        },
    }),
    { name: 'DesktopBenefits' }
);

type Props = {
    open: boolean;
    benefits: SearchDtoBenefitsEnum[];
    className?: string;
};

export const DesktopBenefits: FC<Props> = props => {
    const { open, benefits, className } = props;
    const classes = useStyles();
    const { t } = useTranslation();

    return (
        <div className={clsx(classes.root, className)}>
            {open ? (
                <List className={classes.benefits} disablePadding>
                    {benefits.map(item => {
                        const IconComponent = benefitsIconsMap[item];

                        return (
                            <ListItem
                                className={classes.listItem}
                                key={item}
                                disableGutters
                            >
                                <ListItemIcon className={classes.listItemIcon}>
                                    {IconComponent ? (
                                        <IconComponent color="disabled" />
                                    ) : null}
                                </ListItemIcon>

                                <ListItemText
                                    className={classes.listItemText}
                                    primary={t(
                                        `benefit${upperFirst(camelCase(item))}`
                                    )}
                                />
                            </ListItem>
                        );
                    })}
                </List>
            ) : (
                <div className={classes.icons}>
                    {benefits.map(item => {
                        const IconComponent = benefitsIconsMap[item];

                        return IconComponent ? (
                            <Tooltip
                                title={
                                    t(
                                        `benefit${upperFirst(camelCase(item))}`,

                                        {
                                            defaultValue: 'N/A',
                                        }
                                    ) || ''
                                }
                            >
                                <IconComponent
                                    className={classes.icon}
                                    key={item}
                                    color="disabled"
                                />
                            </Tooltip>
                        ) : null;
                    })}
                </div>
            )}
        </div>
    );
};
