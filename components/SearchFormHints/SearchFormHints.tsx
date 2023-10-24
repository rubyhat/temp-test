import React, { FC } from 'react';
import clsx from 'clsx';
import { makeStyles } from '@material-ui/core/styles';

import { SearchFormHintLink } from './SearchFormHintLink';
import { SeoDto } from 'swagger/client';

export const searchFormHintsHeight = 22;

const useStyles = makeStyles(
    () => ({
        /* Styles applied to the root element. */
        root: {
            height: searchFormHintsHeight,
        },
    }),
    { name: 'SearchFormHints' }
);

type Props = {
    className?: string;
    destinations: SeoDto[];
};

export const SearchFormHints: FC<Props> = props => {
    const { className, destinations } = props;
    const classes = useStyles();

    return (
        <div className={clsx(classes.root, className)}>
            {destinations.map((destination, i) => (
                <SearchFormHintLink key={i} destination={destination} />
            ))}
        </div>
    );
};
