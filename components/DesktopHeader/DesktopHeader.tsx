import React, { ReactNode } from 'react';
import { makeStyles, Theme } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import { useSelector } from 'react-redux';

import { Typo } from 'components/Typo/Typo';
import clsx from 'clsx';
import { publicPath } from 'utils/publicPath';
import { RootState } from 'store';
import { BrandState } from 'store/brand/types';
import { AtlasTheme } from 'typings/atlas-theme';

const useStyles = makeStyles(
    (theme: Theme & AtlasTheme) => ({
        root: {
            background: '#033754',
            backgroundImage: `url(${publicPath('/static/background.webp')})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center top',
            paddingTop: theme.spacing(4),
            paddingBottom: theme.spacing(4),
        },
        longRoot: {
            backgroundPositionY: 'bottom',
        },
        container: {
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            alignItems: 'stretch',
            height: '100%',
        },
        longContainer: {
            minHeight: 280,
        },
        item: {
            textAlign: 'center',
            [theme.breakpoints.up('md')]: {
                textAlign: 'left',
            },
            marginBottom: theme.spacing(2),
        },
        title: {
            color: theme.atlas.palette.textInv.base,
            fontSize: 40,
            lineHeight: 'initial',
            [theme.breakpoints.down('sm')]: {
                fontSize: 26,
            },
        },
        subtitle: {
            marginTop: theme.spacing(2),
            color: theme.atlas.palette.textInv.minor,
        },
    }),
    { name: 'DesktopHeader' }
);

type Props = {
    children: ReactNode;
    compact?: boolean;
    title: string;
    subTitle: string;
};

export const DesktopHeader = React.forwardRef<HTMLElement, Props>(
    (props, ref) => {
        const { children, compact = false, title, subTitle } = props;
        const classes = useStyles();

        const { partner } = useSelector<RootState, BrandState>(
            rootState => rootState.brand
        );

        return (
            <header
                className={clsx(classes.root, {
                    [classes.longRoot]: !compact,
                })}
                style={{
                    backgroundImage:
                        partner && partner.meta && partner.meta.backgroundURL
                            ? `url(${partner.meta.backgroundURL})`
                            : undefined,
                }}
                ref={ref}
            >
                <Container
                    className={clsx(classes.container, {
                        [classes.longContainer]: !compact,
                    })}
                >
                    {!compact && (
                        <div className={classes.item}>
                            <div>
                                <Typo
                                    component="h1"
                                    className={classes.title}
                                    weight="bold"
                                >
                                    {title}
                                </Typo>
                            </div>
                            <div className={classes.subtitle}>
                                <Typo
                                    weight="bold"
                                    variant="title"
                                    component="h2"
                                >
                                    {subTitle}
                                </Typo>
                            </div>
                        </div>
                    )}
                    <div>{children}</div>
                </Container>
            </header>
        );
    }
);
