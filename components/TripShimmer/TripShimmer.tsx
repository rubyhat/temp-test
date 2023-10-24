import React, { FC } from 'react';
import clsx from 'clsx';
import { makeStyles, Theme } from '@material-ui/core/styles';

import { Button } from 'components/ui/Button/Button';
import { Stub } from 'components/Stub/Stub';
import { useTranslation } from 'i18n';
import { AtlasTheme } from 'typings/atlas-theme';

const useStyles = makeStyles(
    (theme: Theme & AtlasTheme) => ({
        /* Styles applied to the root element. */
        root: {
            display: 'flex',
            flexDirection: 'column',
            background: '#fff',
            borderRadius: theme.atlas.borderRadius.medium,
            overflow: 'hidden',
            boxShadow: theme.atlas.shadows.bottom,
            position: 'relative',
        },
        route: {
            padding: theme.spacing(2, 2, 0, 2),
        },
        footer: {
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            marginTop: theme.spacing(2),
        },
        details: {
            fontSize: 16,
            lineHeight: '22px',
            color: theme.atlas.palette.text.link,
            textAlign: 'center',
            minWidth: 120,
            flexGrow: 1,
            cursor: 'pointer',
        },
        button: {
            flexGrow: 1,
        },
    }),
    { name: 'TripShimmer' }
);

type TripShimmerProps = {
    className?: string;
};

export const TripShimmer: FC<TripShimmerProps> = props => {
    const { className } = props;
    const classes = useStyles();
    const { t } = useTranslation();

    return (
        <div className={clsx(classes.root, className)}>
            <div className={classes.route}>
                <div style={{ height: 16 }}>
                    <Stub />
                </div>
            </div>
            <div className={classes.footer}>
                <div className={classes.details}>
                    <div
                        style={{
                            position: 'relative',
                            height: 16,
                            margin: 16,
                        }}
                    >
                        <span style={{ visibility: 'hidden' }}>
                            {t('search:details')}
                        </span>
                        <Stub absolute />
                    </div>
                </div>
                <div className={classes.button}>
                    <Button fullWidth disabled>
                        &nbsp;
                        <Stub absolute />
                    </Button>
                </div>
            </div>
        </div>
    );
};
