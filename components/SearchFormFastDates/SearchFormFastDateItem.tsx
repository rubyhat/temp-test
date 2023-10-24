import React, { FC } from 'react';
import Link from 'next/link';
import { makeStyles, Theme } from '@material-ui/core/styles';
import { useSelector } from 'react-redux';

import { RootState } from 'store';
import { SearchFormState } from 'store/search-form/types';
import { SearchQuery } from 'store/last-search/types';
import { UrlObject } from 'url';
import { useSeoPrefix } from 'hooks/useSeoPrefix';
import { AtlasTheme } from 'typings/atlas-theme';

const useStyles = makeStyles(
    (theme: Theme & AtlasTheme) => ({
        /* Styles applied to the root element. */
        root: {
            color: '#FFF',
            textDecoration: 'none',

            borderBottomWidth: 1,
            borderBottomColor: theme.palette.common.white,
            borderBottomStyle: 'dashed',

            display: 'inline-flex',

            '&:hover': {
                borderBottomStyle: 'dotted',
                opacity: 0.9,
            },

            '& ~ &': {
                marginLeft: 12,
            },
        },
    }),
    { name: 'SearchFormFastDateItem' }
);

type Props = {
    date: string;
    text: string;
};

export const SearchFormFastDateItem: FC<Props> = props => {
    const { date, text } = props;
    const classes = useStyles();
    const { fromValue: from, toValue: to, passengers, time } = useSelector<
        RootState,
        SearchFormState
    >(rootState => rootState.searchForm);

    const { seoPrefix } = useSeoPrefix();

    // Если форма не заполнена мы не можем сформировать URL
    if (!from || !to) {
        return null;
    }

    const queryObj: SearchQuery = {
        from: `${from.id}`,
        fromName: from.name,
        to: `${to.id}`,
        toName: to.name,
        date,
        passengers: Number(passengers),
    };
    if (time) {
        queryObj['time'] = time;
    }
    const href: UrlObject = {
        pathname: '/search',
        query: queryObj,
    };

    const queryObjOther: any = {
        date,
        passengers: Number(passengers),
    };
    if (time) {
        queryObjOther['time'] = time;
    }
    const asHref: UrlObject = {
        pathname: `/${seoPrefix}/${from.name}/${to.name}`,
        query: queryObjOther,
    };

    return (
        <Link href={href} as={asHref}>
            <a className={classes.root}>{text}</a>
        </Link>
    );
};
