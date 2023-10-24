import React, { useEffect } from 'react';
import { NextPage } from 'next';
import { useRouter } from 'next/router';
import { useDispatch, useSelector } from 'react-redux';
import { makeStyles, Theme } from '@material-ui/core/styles';
import CircularProgress from '@material-ui/core/CircularProgress';
import Grid from '@material-ui/core/Grid';
import Container from '@material-ui/core/Container';
import clsx from 'clsx';

import { PassengerDocument } from 'components/PassengerDocument';
import { documentDelete, documentsFetch } from 'store/documents/actions';
import { RootState } from 'store';
import {
    DOCUMENTS_ERROR,
    DOCUMENTS_FETCHING,
    DOCUMENTS_SUCCESS,
    DocumentsState,
} from 'store/documents/types';
import { AppBar } from 'components/AppBar';
import { Typo } from 'components/Typo/Typo';
import { Button } from 'components/ui/Button';
import { NotifyDialog } from 'components/NotifyDialog';
import { useTranslation } from 'i18n';
import { PersonalDataDto } from 'swagger/client';
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
        /* Styles applied to the loading `div` element when `status === DOCUMENTS_FETCHING`. */
        loading: {
            marginTop: theme.spacing(2),
            textAlign: 'center',
        },
        /* Styles applied to the `PassengerDocument` component. */
        document: {
            '& ~ &': {
                marginTop: theme.spacing(2),
            },
        },
        /* Styles applied to the `PassengerDocument` component (desktop). */
        desktopDocument: {
            borderRadius: theme.shape.borderRadius,
            boxShadow: theme.atlas.shadows.bottom,
        },
        /* Styles applied to the noDocuments `div` element when no documents. */
        noDocuments: {
            paddingLeft: theme.spacing(2),
            paddingRight: theme.spacing(2),
            color: theme.atlas.palette.text.disabled,

            [theme.breakpoints.up('md')]: {
                paddingLeft: 0,
                paddingRight: 0,
            },
        },
    }),
    { name: 'Passengers' }
);

type Props = {};

const Passengers: NextPage<Props> = props => {
    const classes = useStyles();
    const { t } = useTranslation();
    const router = useRouter();
    const dispatch = useDispatch();
    const { documents, status } = useSelector<RootState, DocumentsState>(
        rootState => rootState.documents
    );
    const { isMobile, isCordova } = usePlatform();

    const hasNoDocuments =
        documents.length === 0 && status === DOCUMENTS_SUCCESS;

    const handleBack = () => router.back();
    const reload = () => router.reload();
    const goToSearch = () => router.push('/');
    const handleDelete = (document: PersonalDataDto) => {
        dispatch(documentDelete(document));
    };

    useEffect(() => {
        dispatch(documentsFetch());
    }, []);

    // Scroll fix
    useEffect(() => {
        document.body.style.overflow = 'auto';
    }, []);

    if (isMobile || isCordova) {
        return (
            <div className={classes.root}>
                <AppBar
                    title={t('profile:myPassengers')}
                    textCenter
                    position="fixed"
                    onBack={handleBack}
                />

                <div className={classes.container}>
                    {status === DOCUMENTS_SUCCESS ||
                    status === DOCUMENTS_FETCHING ? (
                        hasNoDocuments ? (
                            <Typo
                                color="textSecondary"
                                className={classes.noDocuments}
                            >
                                {t('profile:noDocuments')}
                            </Typo>
                        ) : (
                            <div>
                                {documents.map((doc, i) => (
                                    <PassengerDocument
                                        className={classes.document}
                                        doc={doc}
                                        key={i}
                                        onDelete={handleDelete}
                                    />
                                ))}
                            </div>
                        )
                    ) : status === DOCUMENTS_ERROR ? (
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

                    {status === DOCUMENTS_FETCHING ? (
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
                    pageTitle={t('profile:myPassengers')}
                    backUrl="/"
                    breadcrumbTitle={t('backToSearch')}
                />

                <Container>
                    <Grid container spacing={2}>
                        <Grid item md={4}>
                            <ProfileMenuCard />
                        </Grid>

                        <Grid item md={8}>
                            {status === DOCUMENTS_SUCCESS ||
                            status === DOCUMENTS_FETCHING ? (
                                hasNoDocuments ? (
                                    <Typo
                                        color="textSecondary"
                                        className={classes.noDocuments}
                                    >
                                        {t('profile:noDocuments')}
                                    </Typo>
                                ) : (
                                    <div>
                                        {documents.map((doc, i) => (
                                            <PassengerDocument
                                                className={clsx(
                                                    classes.document,
                                                    classes.desktopDocument
                                                )}
                                                doc={doc}
                                                key={i}
                                                onDelete={handleDelete}
                                            />
                                        ))}
                                    </div>
                                )
                            ) : status === DOCUMENTS_ERROR ? (
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

                            {status === DOCUMENTS_FETCHING ? (
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

Passengers.getInitialProps = async props => {
    return {
        namespacesRequired: ['profile', 'brand'],
    };
};

export default Passengers;
