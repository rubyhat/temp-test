import React, { FC } from 'react';
import Link from 'next/link';
import SearchIcon from '@material-ui/icons/Search';
import { UrlObject } from 'url';
import { makeStyles } from '@material-ui/core/styles';

import { SeoDto } from 'swagger/client';
import { useSeoPrefix } from 'hooks/useSeoPrefix';

const useStyles = makeStyles(
    theme => ({
        /* Styles applied to the root element. */
        root: {
            color: '#FFF',
            textDecoration: 'none',

            display: 'inline-flex',

            '&:hover': {
                textDecoration: 'underline',
            },

            '& ~ &': {
                marginLeft: theme.spacing(2),
            },
        },
        icon: {
            marginRight: 4,
        },
    }),
    { name: 'SearchFormHintLink' }
);

type Props = {
    destination: SeoDto;
};

export const SearchFormHintLink: FC<Props> = props => {
    const { destination } = props;
    const { from, to } = destination;
    const classes = useStyles();

    const { seoPrefix } = useSeoPrefix();

    const href: UrlObject = {
        pathname: '/search',
        query: {
            from: `c${from.id}`,
            fromName: from.name,
            to: `c${to.id}`,
            toName: to.name,
        },
    };
    const asHref: UrlObject = {
        pathname: `/${seoPrefix}/${from.name}/${to.name}`,
    };

    return (
        <Link href={href} as={asHref}>
            <a className={classes.root}>
                <SearchIcon className={classes.icon} fontSize="small" />

                <span>
                    {destination.from.name} – {destination.to.name}
                </span>
            </a>
        </Link>
    );
};
