import React, { useEffect } from 'react';
import { NextPage } from 'next';
import { useRouter } from 'next/router';
import { useDispatch, useSelector } from 'react-redux';
import { makeStyles, Theme } from '@material-ui/core/styles';
import CircularProgress from '@material-ui/core/CircularProgress';
import Container from '@material-ui/core/Container';
import Grid from '@material-ui/core/Grid';
import clsx from 'clsx';

import { RootState } from 'store';
import { AppBar } from 'components/AppBar';
import { Typo } from 'components/Typo/Typo';
import { Button } from 'components/ui/Button';
import { NotifyDialog } from 'components/NotifyDialog';
import { CreditCard } from 'components/CreditCard';
import {
    CARDS_ERROR,
    CARDS_FETCHING,
    CARDS_SUCCESS,
    CardsState,
} from 'store/credit-cards/types';
import { cardDelete, cardsFetching } from 'store/credit-cards/actions';
import { useTranslation } from 'i18n';
import { usePlatform } from 'hooks/usePlatform';
import { DesktopHeading } from 'components/DesktopHeading';
import { ProfileMenuCard } from 'components/ProfileMenuCard';
import { Desktop } from 'layouts/desktop';
import { AtlasTheme } from 'typings/atlas-theme';

const useStyles = makeStyles(
    (theme: Theme & AtlasTheme) => ({
        /* Styles applied to the root element. */
        root: {},
        /* Styles applied to the container `div` element. */
        container: {
            ...theme.atlas.appBar.marginTop(16), // AppBar height + 16,
            marginBottom: 16,
        },
        /* Styles applied to the loading `div` element when `status === CARDS_FETCHING`. */
        loading: {
            marginTop: theme.spacing(2),
            textAlign: 'center',
        },
        /* Styles applied to the `CreditCard` component. */
        creditCard: {
            '& ~ &': {
                marginTop: theme.spacing(2),
            },
        },
        /* Styles applied to the `CreditCard` component (desktop). */
        desktopCreditCard: {
            borderRadius: theme.shape.borderRadius,
            boxShadow: theme.atlas.shadows.bottom,
        },
        /* Styles applied to the noCreditCards `div` element when no credit cards. */
        noCreditCards: {
            paddingLeft: theme.spacing(2),
            paddingRight: theme.spacing(2),
            color: theme.atlas.palette.text.disabled,

            [theme.breakpoints.up('md')]: {
                paddingLeft: 0,
                paddingRight: 0,
            },
        },
    }),
    { name: 'CreditCards' }
);

type Props = {};

const CreditCards: NextPage<Props> = props => {
    const classes = useStyles();
    const { t } = useTranslation();
    const router = useRouter();
    const dispatch = useDispatch();
    const { cards, status } = useSelector<RootState, CardsState>(
        rootState => rootState.cards
    );
    const { isMobile, isCordova } = usePlatform();

    const hasNoCredidCards = cards.length === 0 && status === CARDS_SUCCESS;

    const handleBack = () =>
        window.history.length > 1 ? router.back() : router.replace('/profile');
    const reload = () => router.reload();
    const goToSearch = () => router.push('/');
    const handleDelete = (cardId: number) => {
        dispatch(cardDelete(cardId));
    };

    useEffect(() => {
        dispatch(cardsFetching());
    }, []);

    // Scroll fix
    useEffect(() => {
        document.body.style.overflow = 'auto';
    }, []);

    if (isMobile || isCordova) {
        return (
            <div className={classes.root}>
                <AppBar
                    title={t('profile:myCreditCards')}
                    textCenter
                    position="fixed"
                    onBack={handleBack}
                />

                <div className={classes.container}>
                    {status === CARDS_SUCCESS || status === CARDS_FETCHING ? (
                        hasNoCredidCards ? (
                            <Typo
                                color="textSecondary"
                                className={classes.noCreditCards}
                            >
                                {t('profile:noCards')}
                            </Typo>
                        ) : (
                            <div>
                                {cards.map(card => (
                                    <CreditCard
                                        className={classes.creditCard}
                                        card={card}
                                        key={card.id}
                                        onDelete={handleDelete}
                                    />
                                ))}
                            </div>
                        )
                    ) : status === CARDS_ERROR ? (
                        <NotifyDialog
                            open={true}
                            title={t('profile:somethingWentWrong')}
                            subtitle={t('profile:somethingWentWrongDesc')}
                            actions={
                                <Grid container spacing={2}>
                                    <Grid item xs={12} md={6}>
                                        <Button
                                            onClick={reload}
                                            variant="contained"
                                            color="primary"
                                            fullWidth
                                        >
                                            {t('profile:check')}
                                        </Button>
                                    </Grid>

                                    <Grid item xs={12} md={6}>
                                        <Button
                                            onClick={goToSearch}
                                            variant="outlined"
                                            color="primary"
                                            fullWidth
                                        >
                                            {t('profile:backToSearch')}
                                        </Button>
                                    </Grid>
                                </Grid>
                            }
                        />
                    ) : null}

                    {status === CARDS_FETCHING ? (
                        <div className={classes.loading}>
                            <CircularProgress />
                        </div>
                    ) : null}
                </div>
            </div>
        );
    } else {
        return (
            <Desktop>
                <DesktopHeading
                    pageTitle={t('profile:myCreditCards')}
                    backUrl="/"
                    breadcrumbTitle={t('backToSearch')}
                />

                <Container>
                    <Grid container spacing={2}>
                        <Grid item md={4}>
                            <ProfileMenuCard />
                        </Grid>

                        <Grid item md={8}>
                            {status === CARDS_SUCCESS ||
                            status === CARDS_FETCHING ? (
                                hasNoCredidCards ? (
                                    <Typo
                                        color="textSecondary"
                                        className={classes.noCreditCards}
                                    >
                                        {t('profile:noCards')}
                                    </Typo>
                                ) : (
                                    <div>
                                        {cards.map(card => (
                                            <CreditCard
                                                className={clsx(
                                                    classes.creditCard,
                                                    classes.desktopCreditCard
                                                )}
                                                card={card}
                                                key={card.id}
                                                onDelete={handleDelete}
                                            />
                                        ))}
                                    </div>
                                )
                            ) : status === CARDS_ERROR ? (
                                <NotifyDialog
                                    open={true}
                                    title={t('profile:somethingWentWrong')}
                                    subtitle={t(
                                        'profile:somethingWentWrongDesc'
                                    )}
                                    actions={
                                        <Grid container spacing={2}>
                                            <Grid item xs={12} md={6}>
                                                <Button
                                                    onClick={reload}
                                                    variant="contained"
                                                    color="primary"
                                                    fullWidth
                                                >
                                                    {t('profile:check')}
                                                </Button>
                                            </Grid>

                                            <Grid item xs={12} md={6}>
                                                <Button
                                                    onClick={goToSearch}
                                                    variant="outlined"
                                                    color="primary"
                                                    fullWidth
                                                >
                                                    {t('profile:backToSearch')}
                                                </Button>
                                            </Grid>
                                        </Grid>
                                    }
                                />
                            ) : null}

                            {status === CARDS_FETCHING ? (
                                <div className={classes.loading}>
                                    <CircularProgress />
                                </div>
                            ) : null}
                        </Grid>
                    </Grid>
                </Container>
            </Desktop>
        );
    }
};

CreditCards.getInitialProps = async props => {
    return {
        namespacesRequired: ['profile', 'brand'],
    };
};

export default CreditCards;
