import React, { useEffect } from 'react';
import * as Sentry from '@sentry/browser';
import { NextPage } from 'next';
import { version } from '../package.json';
import { useTranslation } from 'i18n';
import { NotifyDialog } from 'components/NotifyDialog';
import { useRouter } from 'next/router';
import Grid from '@material-ui/core/Grid';
import { Button } from 'components/ui/Button';
import NotFound from 'pages/not-found';
import { getReleaseVersion } from 'utils/version';

if (process.browser) {
    const isCompasBus = window.location.hostname.includes('compasbus');
    Sentry.init({
        // dsn: process.env.SENTRY_DSN,
        // dsn: 'https://9e974e3ac4cb4ffc9211647f6ae1fe4b@sentry.atlasteam.me/5',
        dsn: isCompasBus
            ? 'https://ed03db8c16a94d63aa68347a6e901f20@sentry.compasbus.pl/3'
            : 'https://9e974e3ac4cb4ffc9211647f6ae1fe4b@sentry.atlasteam.me/5',
        environment: process.env.APP_STAGE,
        release: getReleaseVersion(),
    });
}

type Props = {
    statusCode: number | null | undefined;
};

const Error: NextPage<Props> = props => {
    const { statusCode } = props;
    const { t } = useTranslation();
    const router = useRouter();
    const goToSearch = () => {
        router.push('/');
    };

    // Scroll fix
    useEffect(() => {
        document.body.style.overflow = 'auto';
    }, []);

    if (statusCode === 404) {
        return <NotFound />;
    }

    return (
        <div>
            <NotifyDialog
                open={true}
                title={t('common:errorPageTitle')}
                subtitle={t('common:errorPageSubtitle', { version })}
                actions={
                    <Grid container spacing={2} justify="space-around">
                        <Grid item xs={12} md={6}>
                            <Button
                                onClick={goToSearch}
                                variant="outlined"
                                color="primary"
                                fullWidth
                            >
                                {t('common:backToSearch')}
                            </Button>
                        </Grid>
                    </Grid>
                }
            />
        </div>
    );
};

Error.getInitialProps = ({ req, res, err }) => {
    let statusCode: number | null | undefined;

    if (res) {
        ({ statusCode } = res);
    } else if (err) {
        ({ statusCode } = err);
    } else {
        statusCode = null;
    }

    Sentry.configureScope(scope => {
        if (!req) {
            scope.setTag(`ssr`, 'false');
        } else {
            scope.setTag(`ssr`, 'true');
            scope.setExtra(`url`, req.url);
            scope.setExtra(`statusCode`, statusCode);
            scope.setExtra(`headers`, req.headers);
        }
    });

    Sentry.captureException(err);

    return { statusCode };
};

export default Error;
