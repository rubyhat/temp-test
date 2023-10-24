import React, { FC, useState } from 'react';
import Collapse from '@material-ui/core/Collapse';
import ListItem, { ListItemProps } from '@material-ui/core/ListItem';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import ListItemText from '@material-ui/core/ListItemText';
import { makeStyles, Theme } from '@material-ui/core/styles';

import { RideDetail } from './RideDetailsList';
import { Typo } from '../Typo/Typo';
import { useTranslation } from 'i18n';

const useStyles = makeStyles(
    (theme: Theme) => ({
        /* Styles applied to the `Collapse` component. */
        collapse: {
            paddingLeft: theme.spacing(2),
            paddingRight: theme.spacing(2),
        },
        /* Styles applied to the collapse action `div` element. */
        collapseAction: {
            textDecoration: 'underline',
            color: theme.palette.primary.main,
            cursor: 'pointer',
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
            flexGrow: 1,
        },
        /* Styles applied to the right `ListItemText` component. */
        listItemTextRight: {
            flexGrow: 0,
            textAlign: 'right',
            maxWidth: '75%',
        },
    }),
    { name: 'RideDetailsListItem' }
);

type Props = {
    item: RideDetail;
} & Pick<ListItemProps, 'disableGutters'>;

export const RideDetailsListItem: FC<Props> = props => {
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
            <ListItem {...ListItemProps}>
                <ListItemText
                    className={classes.listItemTextLeft}
                    primary={<Typo color="textSecondary">{item.name}</Typo>}
                />

                <ListItemText
                    onClick={handleClick}
                    className={classes.listItemTextRight}
                    primary={
                        item.collapsed ? (
                            <span className={classes.collapseAction}>
                                {open ? t('collapse') : t('expand')}
                            </span>
                        ) : (
                            <Typo color="textPrimary" {...itemProps} />
                        )
                    }
                />
            </ListItem>

            {item.collapsed ? (
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
            ) : null}
        </>
    );
};
