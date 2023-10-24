import React, { FC } from 'react';
import ArrowForwardIcon from '@material-ui/icons/ArrowForward';
import Grid from '@material-ui/core/Grid';
import Link from 'next/link';
import clsx from 'clsx';
import { UrlObject } from 'url';
import { makeStyles, Theme } from '@material-ui/core/styles';
import { useSelector } from 'react-redux';

import { Button } from 'components/ui/Button';
import { LastSearchState } from 'store/last-search/types';
import { RootState } from 'store';
import { Typo } from 'components/Typo/Typo';
import { carriersAmocrmLink } from 'utils/carriersAmocrmLink';
import { usePlatform } from 'hooks/usePlatform';
import { useTranslation } from 'i18n';
import { AtlasTheme } from 'typings/atlas-theme';

const useStyles = makeStyles(
    (theme: Theme & AtlasTheme) => ({
        /* Styles applied to the root element. */
        root: {
            backgroundColor: theme.palette.common.white,
            boxShadow: theme.atlas.shadows.bottom,
            borderRadius: theme.shape.borderRadius,

            padding: theme.spacing(2),

            position: 'relative',
        },
        /* Styles applied to the card content `div` element. */
        content: {},
        description: {
            marginTop: theme.spacing(1),
        },
        containerButton: {
            marginTop: theme.spacing(2),
        },
        button: {
            borderRadius: 10,
        },
    }),
    { name: 'CarbusPartnerCard' }
);

type Props = {
    className?: string;
};

export const CarbusPartnerCard: FC<Props> = props => {
    const { className } = props;
    const classes = useStyles();
    const { t } = useTranslation();
    const { isMobile } = usePlatform();

    const { lastSearch } = useSelector<RootState, LastSearchState>(
        rootState => rootState.lastSearch
    );
    if (!lastSearch) return null;
    const { from, to } = lastSearch;

    const href: UrlObject = {
        pathname: isMobile ? carriersAmocrmLink : '/carriers',
    };

    return (
        <div className={clsx(className, classes.root)}>
            <div className={classes.content}>
                <Typo variant="title" weight="bold" align="center">
                    {t('search:carbusPartnerTitle')}
                </Typo>
                <Typo
                    variant="body1"
                    align="center"
                    className={classes.description}
                >
                    {t('search:carbusPartnerDescription')}
                </Typo>

                <Grid
                    container
                    justify="space-around"
                    className={classes.containerButton}
                >
                    <Grid item xs={12} md={4} lg={3}>
                        <Link href={href} passHref>
                            <div>
                                <Button
                                    color="primary"
                                    variant="contained"
                                    fullWidth
                                    className={classes.button}
                                    endIcon={<ArrowForwardIcon />}
                                >
                                    {t('search:carbusPartnerButton')}
                                </Button>
                            </div>
                        </Link>
                    </Grid>
                </Grid>
            </div>
        </div>
    );
};
