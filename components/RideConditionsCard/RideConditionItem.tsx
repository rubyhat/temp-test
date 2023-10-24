import React, { FC, useState } from 'react';
import Collapse from '@material-ui/core/Collapse';
import IconButton from '@material-ui/core/IconButton';
import KeyboardArrowDownIcon from '@material-ui/icons/KeyboardArrowDown';
import KeyboardArrowRightIcon from '@material-ui/icons/KeyboardArrowRight';
import ListItem, { ListItemProps } from '@material-ui/core/ListItem';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import ListItemText from '@material-ui/core/ListItemText';
import { makeStyles, Theme } from '@material-ui/core/styles';

import { RideCondition } from './RideConditionsCard';
import { Typo } from '../Typo/Typo';
import { useTranslation } from 'i18n';
import { AtlasTheme } from 'typings/atlas-theme';

const useStyles = makeStyles(
    (theme: Theme & AtlasTheme) => ({
        /* Styles applied to the `Collapse` component. */
        collapse: {
            paddingLeft: theme.spacing(2),
            paddingRight: theme.spacing(2),
        },
        arrowIcon: {
            fontSize: 28,
            color: theme.atlas.palette.icons.secondary,
        },
        /* Styles applied to the collapse content `div` element. */
        collapseContent: {
            marginBottom: theme.spacing(2),
            '& h1': {
                fontSize: theme.typography.body1.fontSize,
                marginTop: 0,
            },
            '& ul': {
                paddingLeft: 0,
                listStyleType: 'disc',
                listStylePosition: 'inside',
            },
            '& li': {
                lineHeight: 1.5,

                '& ~ li': {
                    marginTop: 4,
                },
            },
        },
        /* Styles applied to the left `ListItemText` component. */
        listItemTextLeft: {
            color: theme.palette.common.black,
        },
    }),
    { name: 'RideConditionItem' }
);

type RideConditionItemProps = {
    item: RideCondition;
} & Pick<ListItemProps, 'disableGutters'>;

export const RideConditionItem: FC<RideConditionItemProps> = props => {
    const { item, ...ListItemProps } = props;
    const [open, setOpen] = useState(false);
    const { t } = useTranslation();
    const classes = useStyles();

    const handleClick = () => {
        if (item.collapsed) setOpen(!open);
    };

    const itemProps = item.html
        ? {
              dangerouslySetInnerHTML: { __html: item.value },
          }
        : {
              children: item.value,
          };

    return (
        <>
            <ListItem {...ListItemProps} onClick={handleClick}>
                <ListItemText
                    className={classes.listItemTextLeft}
                    primary={<Typo>{item.name}</Typo>}
                />

                <ListItemSecondaryAction>
                    <IconButton
                        onClick={handleClick}
                        edge="end"
                        disableRipple
                        disableFocusRipple
                        disableTouchRipple
                    >
                        {open ? (
                            <KeyboardArrowDownIcon
                                className={classes.arrowIcon}
                            />
                        ) : (
                            <KeyboardArrowRightIcon
                                className={classes.arrowIcon}
                            />
                        )}
                    </IconButton>
                </ListItemSecondaryAction>
            </ListItem>

            <Collapse
                className={classes.collapse}
                in={open}
                timeout="auto"
                unmountOnExit
            >
                <Typo
                    className={classes.collapseContent}
                    component="div"
                    {...itemProps}
                />
            </Collapse>
        </>
    );
};
