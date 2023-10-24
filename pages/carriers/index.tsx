import React, { useEffect, useRef } from 'react';
import Container from '@material-ui/core/Container';
import Grid from '@material-ui/core/Grid';
import { NextPage } from 'next';
import { makeStyles, Theme } from '@material-ui/core/styles';

import { Desktop } from 'layouts/desktop';
import { DesktopHeading } from 'components/DesktopHeading';
import { HelpMenuCard } from 'components/HelpMenuCard';
import { useTranslation } from 'i18n';
import { AtlasTheme } from 'typings/atlas-theme';

const useStyles = makeStyles(
    (theme: Theme & AtlasTheme) => ({
        /* Styles applied to the root element. */
        root: {},
        desktopCard: {
            backgroundColor: '#FFF',
            borderRadius: theme.shape.borderRadius,
            boxShadow: theme.atlas.shadows.bottom,
            padding: theme.spacing(2),
            maxWidth: '547px',
        },
    }),
    { name: 'Carriers' }
);

type Props = {};

declare global {
    interface Window {
        amo_forms_params: any;
    }
}

const Carriers: NextPage<Props> = () => {
    const classes = useStyles();
    const { t } = useTranslation();
    const cardRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        if (cardRef.current) {
            const script = document.createElement('script');
            const scriptSecond = document.createElement('script');

            script.src =
                'https://forms.amocrm.ru/forms/assets/js/amoforms.js?1669635075';
            script.charset = 'utf-8';
            script.async = true;
            script.id = 'amoforms_script_355549';

            cardRef.current.appendChild(script);

            scriptSecond.textContent = `!(function (a, m, o, c, r, m) {
        (a[o + c] = a[o + c] || {
          setMeta: function (p) {
            this.params = (this.params || []).concat([p]);
          },
        }),
          (a[o + r] =
            a[o + r] ||
            function (f) {
              a[o + r].f = (a[o + r].f || []).concat([f]);
            }),
          a[o + r]({
            id: "355549",
            hash: "7e7e97beb069495da0c909e2866d42af",
            locale: "ru",
          }),
          (a[o + m] =
            a[o + m] ||
            function (f, k) {
              a[o + m].f = (a[o + m].f || []).concat([[f, k]]);
            });
      })(window, 0, "amo_forms_", "params", "load", "loaded");`;

            cardRef.current.appendChild(scriptSecond);
        }
    }, [cardRef]);

    // Scroll fix
    useEffect(() => {
        document.body.style.overflow = 'auto';
    }, []);

    return (
        <Desktop>
            <DesktopHeading
                pageTitle={t('forCarriers')}
                backUrl="/"
                breadcrumbTitle={t('backToSearch')}
            />

            <Container>
                <Grid container spacing={2}>
                    <Grid item md={4}>
                        <HelpMenuCard />
                    </Grid>

                    <Grid item md={8}>
                        <div className={classes.desktopCard} ref={cardRef} />
                    </Grid>
                </Grid>
            </Container>
        </Desktop>
    );
};

Carriers.getInitialProps = async () => {
    return {
        namespacesRequired: ['auth', 'brand'],
    };
};

export default Carriers;
