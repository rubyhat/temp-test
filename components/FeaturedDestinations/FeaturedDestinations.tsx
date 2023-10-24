import React, { FC, ReactNode } from 'react';
import Grid from '@material-ui/core/Grid';
import clsx from 'clsx';
import { makeStyles } from '@material-ui/core/styles';

import {
    FeaturedDestinationCard,
    FeaturedDestinationProps,
} from './FeaturedDestinationCard';
import { SeoDto } from 'swagger/client';
import { Typo } from 'components/Typo/Typo';
import { usePlatform } from 'hooks/usePlatform';

const useStyles = makeStyles(
    () => ({
        /* Styles applied to the root element. */
        root: {
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
        },
        container: {},
        headline: {},
    }),
    { name: 'FeaturedDestinations' }
);

type Props = {
    className?: string;
    destinations: SeoDto[];
    title?: ReactNode;
    limit?: number;
    FeaturedDestinationProps?: Partial<FeaturedDestinationProps>;
};

export const FeaturedDestinations: FC<Props> = props => {
    const {
        className,
        destinations,
        title,
        FeaturedDestinationProps,
        limit = 6,
    } = props;
    const classes = useStyles();
    const { isMobile } = usePlatform();

    return (
        <div className={clsx(classes.root, className)}>
            <Grid
                className={classes.container}
                container
                spacing={isMobile ? 2 : 3}
            >
                {title && (
                    <Grid item xs={12}>
                        <Typo
                            variant="title"
                            weight="bold"
                            className={classes.headline}
                        >
                            {title}
                        </Typo>
                    </Grid>
                )}

                {destinations.slice(0, limit).map((destination, i) => (
                    <Grid item xs={12} md={4} key={i}>
                        <FeaturedDestinationCard
                            destination={destination}
                            {...FeaturedDestinationProps}
                        />
                    </Grid>
                ))}
            </Grid>
        </div>
    );
};
