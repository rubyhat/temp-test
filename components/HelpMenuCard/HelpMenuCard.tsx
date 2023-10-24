import React, { FC, useRef } from 'react';
import Divider from '@material-ui/core/Divider';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import clsx from 'clsx';
import { makeStyles, Theme } from '@material-ui/core/styles';
import { useRouter } from 'next/router';
import { useSelector } from 'react-redux';

import { List } from '../ui/List/List';
import { useTranslation } from 'i18n';
import { RootState } from 'store';
import { CountryState } from 'store/country/types';
import { useSAAS } from 'hooks/useSAAS';
import { AtlasTheme } from 'typings/atlas-theme';
import { PolicyState } from 'store/saasPolicyInfo/types';

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
        itemListText: {
            fontWeight: 500,
        },
        itemDivider: {
            backgroundColor: '#D8DDDF',
        },
    }),
    { name: 'HelpMenuCard' }
);

type Props = {
    className?: string;
};

export const HelpMenuCard: FC<Props> = props => {
    const { className } = props;
    const classes = useStyles();
    const router = useRouter();
    const { t } = useTranslation();
    const { country } = useSelector<RootState, CountryState>(
        rootState => rootState.country
    );
    const { link: policyLink, isActive: isPolicyActive } = useSelector<
        RootState,
        PolicyState
    >(rootState => rootState.policy);
    const { isAtlas, meta } = useSAAS();

    const handleClick = (pathname: string) => () => {
        router.replace(pathname);
    };
    const { current: listItemsClasses } = useRef({
        selected: classes.itemSelected,
    });

    const partnerPage = {
        label: t('partners'),
        pathname: '/partners',
    };
    let items = [{ pathname: '/help', label: t('contacts') }];
    if (country === 'BY' && isAtlas) {
        items.splice(1, 0, partnerPage);
    }
    if (meta.termsIframeURL[country]) {
        items.push({ pathname: '/terms', label: t('termsOfUse') });
    }
    if (isPolicyActive && policyLink) {
        items.push({ pathname: '/privacy', label: t('termsOfPrivacy') });
    }
    if (meta.driversIframeURL) {
        items.push({ pathname: '/drivers', label: t('forDrivers') });
    }
    if (isAtlas) {
        items.push({ pathname: '/carriers', label: t('forCarriers') });
    }

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
                            <ListItemText
                                primaryTypographyProps={{
                                    className: classes.itemListText,
                                }}
                                primary={item.label}
                            />
                        </ListItem>

                        {i + 1 < items.length ? (
                            <Divider
                                className={classes.itemDivider}
                                variant="middle"
                            />
                        ) : null}
                    </React.Fragment>
                ))}
            </List>
        </div>
    );
};
