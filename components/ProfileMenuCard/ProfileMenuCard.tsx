import React, { FC, useRef } from 'react';
import Divider from '@material-ui/core/Divider';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import clsx from 'clsx';
import { batch, useDispatch } from 'react-redux';
import { makeStyles, Theme } from '@material-ui/core/styles';
import { useRouter } from 'next/router';

import { List } from '../ui/List/List';
import { authReset } from 'store/auth/actions';
import { useTranslation } from 'i18n';
import { userLogout } from 'store/user/actions';
import { useSAAS } from 'hooks/useSAAS';
import { AtlasTheme } from 'typings/atlas-theme';

const useStyles = makeStyles(
    (theme: Theme & AtlasTheme) => ({
        /* Styles applied to the root element. */
        root: {
            borderRadius: theme.shape.borderRadius,
            boxShadow: theme.atlas.shadows.bottom,
            backgroundColor: '#FFF',
        },
        /* Pseudo-class applied to the `ListItem` component if `selected={true}`. */
        itemSelected: {
            '&.Mui-selected, &.Mui-selected:hover': {
                backgroundColor: 'unset',
                color: theme.palette.primary.main,
            },
        },
    }),
    { name: 'ProfileMenuCard' }
);

type Props = {
    className?: string;
};

export const ProfileMenuCard: FC<Props> = props => {
    const { className } = props;
    const classes = useStyles();
    const router = useRouter();
    const dispatch = useDispatch();
    const { t } = useTranslation();
    const { meta } = useSAAS();

    const handleClick = (pathname: string) => () => {
        if (pathname === '/logout') {
            batch(() => {
                dispatch(authReset());
                dispatch(userLogout());
            });

            router.push('/');

            return;
        }

        router.replace(pathname);
    };
    const { current: listItemsClasses } = useRef({
        selected: classes.itemSelected,
    });

    const items = [
        { pathname: '/profile', label: t('profile') },
        { pathname: '/profile/settings', label: t('profile:settings') },
        { pathname: '/profile/passengers', label: t('profile:myPassengers') },
        { pathname: '/profile/cards', label: t('profile:myCreditCards') },
        {
            pathname: '/profile/miles',
            label: t('profile:myMiles'),
            disabled: meta.milesDisabled,
        },
        {
            pathname: '/profile/rating',
            label: t('profile:myKarma'),
            disabled: meta.ratingDisabled,
        },
        { pathname: '/logout', label: t('profile:logout') },
    ].filter(page => !page.disabled);

    return (
        <div className={clsx(classes.root, className)}>
            <List>
                {items.map((item, i) => (
                    <React.Fragment key={item.pathname}>
                        <ListItem
                            classes={listItemsClasses}
                            button
                            onClick={handleClick(item.pathname)}
                            selected={item.pathname === router.pathname}
                        >
                            <ListItemText primary={item.label} />
                        </ListItem>

                        {i + 1 < items.length ? (
                            <Divider variant="middle" />
                        ) : null}
                    </React.Fragment>
                ))}
            </List>
        </div>
    );
};
