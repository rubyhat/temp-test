import React, { FC } from 'react';
import Container from '@material-ui/core/Container';
import Grid from '@material-ui/core/Grid';
import clsx from 'clsx';
import { ArrowLeftIcon } from '@material-ui/pickers/_shared/icons/ArrowLeftIcon';
import { makeStyles, Theme } from '@material-ui/core/styles';
import { useRouter } from 'next/router';

import { Button } from '../ui/Button';
import { Typo } from '../Typo/Typo';
import Head from 'next/head';

const useStyles = makeStyles(
    (theme: Theme) => ({
        /* Styles applied to the root element. */
        root: {},
    }),
    { name: 'DesktopHeading' }
);

type Props = {
    pageTitle: string;
    backUrl: string;
    useRouterBack?: boolean;
    breadcrumbTitle: string;
    className?: string;
};

export const DesktopHeading: FC<Props> = props => {
    const {
        breadcrumbTitle,
        pageTitle,
        backUrl,
        useRouterBack,
        className,
    } = props;
    const classes = useStyles();
    const router = useRouter();

    const onBreadcrumbClick = () => {
        if (useRouterBack && window.history.length > 1) {
            router.back();
        } else {
            router.push(backUrl);
        }
    };

    return (
        <Container className={clsx(classes.root, className)}>
            <Head>
                <title>{pageTitle}</title>
            </Head>
            <Grid container spacing={2}>
                <Grid item md={4}>
                    <Button
                        onClick={onBreadcrumbClick}
                        variant="text"
                        startIcon={<ArrowLeftIcon />}
                        color="primary"
                    >
                        {breadcrumbTitle}
                    </Button>
                </Grid>

                <Grid item md={8}>
                    <Typo variant="header" weight="bold">
                        {pageTitle}
                    </Typo>
                </Grid>
            </Grid>
        </Container>
    );
};
