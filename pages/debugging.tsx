import React, { useEffect } from 'react';
import Checkbox from '@material-ui/core/Checkbox';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Router, { useRouter } from 'next/router';
import { NextPage } from 'next';
import { makeStyles, Theme } from '@material-ui/core/styles';

import { AppBar } from 'components/AppBar';
import { useDebugging } from 'hooks/useDebugging';
import { useTranslation } from 'i18n';
import { AtlasTheme } from 'typings/atlas-theme';

const useStyles = makeStyles(
    (theme: Theme & AtlasTheme) => ({
        /* Styles applied to the root element. */
        root: {},
        /* Styles applied to the container `div` element. */
        container: {
            ...theme.atlas.appBar.marginTop(16), // AppBar height + 16,
            marginBottom: 16,

            paddingLeft: theme.spacing(2),
            paddingRight: theme.spacing(2),
        },
    }),
    { name: 'Debug' }
);

type Props = {};

// Это страница предназначена для админов,
// для тестирования разных фич у которых сложный флоу,
// типа диалога "Оценить поездку" и диалога с Рефералкой
const Debugging: NextPage<Props> = props => {
    const classes = useStyles();
    const router = useRouter();
    const { t } = useTranslation();

    const {
        reviewOrder,
        setReviewOrder,
        referral,
        setReferral,
    } = useDebugging();

    // Scroll fix
    useEffect(() => {
        document.body.style.overflow = 'auto';
    }, []);

    return (
        <div className={classes.root}>
            <AppBar
                title={t('debugging')}
                position="fixed"
                textCenter
                onBack={() => router.back()}
            />

            <div className={classes.container}>
                <div>
                    <FormControlLabel
                        control={
                            <Checkbox
                                checked={reviewOrder}
                                onChange={e => setReviewOrder(e.target.checked)}
                                name="review-orders"
                                color="primary"
                            />
                        }
                        label="Оценить поездку"
                    />
                </div>

                <div>
                    <FormControlLabel
                        control={
                            <Checkbox
                                checked={referral}
                                onChange={e => setReferral(e.target.checked)}
                                name="referral"
                                color="primary"
                            />
                        }
                        label="Рефералка"
                    />
                </div>
            </div>
        </div>
    );
};

Debugging.getInitialProps = async props => {
    const { store } = props;

    const { user } = store.getState();
    const isLoggedIn = !!user.phoneNumber;

    if (!isLoggedIn) {
        if (process.browser) {
            Router.replace('/login');
        }
    }

    return {
        namespacesRequired: ['profile', 'brand'],
    };
};

export default Debugging;
