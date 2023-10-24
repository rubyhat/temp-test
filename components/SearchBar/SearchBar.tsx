import React, { FC } from 'react';
import clsx from 'clsx';
import parseISO from 'date-fns/parseISO';
import SearchIcon from '@material-ui/icons/Search';
import IconButton from '@material-ui/core/IconButton';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import { makeStyles } from '@material-ui/core/styles';
import { useSelector } from 'react-redux';

import theme from 'themes/default';
import { AppBar } from '../AppBar';
import { RootState } from 'store';
import { LastSearchState } from 'store/last-search/types';
import { format } from 'utils/date';
import { useTranslation } from 'i18n';
import { isCordova } from 'utils/platform';
import { useCountry } from 'hooks/useCountry';
import { Props as AppBarProps } from 'components/AppBar';
import { RouteNameWithArrow } from 'components/RouteNameWithArrow';

type SearchBarProps = {
    visible: boolean;
    onSearchClick?: () => void;
    className?: string;
    AppBarProps?: Partial<AppBarProps>;
};

const useStyles = makeStyles(
    {
        /* Styles applied to the root element. */
        root: {
            display: 'none',
        },
        /* Styles applied to the root element when `visible={true}`. */
        visible: {
            display: 'block',
        },
    },
    { name: 'SearchBar' }
);

export const SearchBar: FC<SearchBarProps> = props => {
    const { visible, onSearchClick = () => {}, className, AppBarProps } = props;
    const classes = useStyles();
    const isDesktop = useMediaQuery(theme.breakpoints.up('md'));
    const { t } = useTranslation();
    const { country } = useCountry();

    const { lastSearch } = useSelector<RootState, LastSearchState>(
        rootState => rootState.lastSearch
    );

    const formattedDate = lastSearch
        ? format(parseISO(lastSearch.date), 'd MMM, EEEEEE')
        : '';
    const title = lastSearch ? (
        <RouteNameWithArrow
            departure={lastSearch.from.name}
            arrival={lastSearch.to.name}
        />
    ) : (
        t('searchBarTitle', {
            context: country,
        })
    );
    const subtitle = lastSearch
        ? `${formattedDate} · ${lastSearch.passengers} ${t('people', {
              count: lastSearch.passengers,
          })}`
        : undefined;

    const isVisible = visible && (!isDesktop || isCordova); // && isSearchFormFilled;

    return (
        <div
            className={clsx(
                {
                    [classes.root]: true,
                    [classes.visible]: isVisible,
                },
                className
            )}
        >
            <AppBar
                {...AppBarProps}
                title={title}
                titleOverflowHidden
                subtitle={subtitle}
                endIcon={
                    <IconButton edge="end" onClick={onSearchClick}>
                        <SearchIcon color="primary" />
                    </IconButton>
                }
                disableBackIcon
                position="fixed"
            />
        </div>
    );
};
