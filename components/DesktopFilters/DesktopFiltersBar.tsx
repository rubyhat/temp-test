import React, { FC } from 'react';
import { makeStyles, Theme } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import clsx from 'clsx';

import { useTranslation } from 'i18n';
import { AtlasTheme } from 'typings/atlas-theme';

const useStyles = makeStyles(
    (theme: Theme & AtlasTheme) => ({
        /* Styles applied to the root element. */
        root: {
            backgroundColor: '#FFF',
            height: 48,
        },
        /* Styles applied to the container `div` element. */
        container: {
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            height: 'inherit',
            padding: theme.spacing(0, 1, 0, 2),
        },
        /* Styles applied to the filters count `div` element. */
        filtersCount: {
            fontWeight: 'bold',
        },
        /* Styles applied to the reset `Button` component. */
        resetButton: {
            fontSize: theme.atlas.typography.body1.fontSize,
            textTransform: 'unset',
            padding: '0 4px',
            '&:hover': {
                backgroundColor: 'unset',
            },
        },
    }),
    { name: 'DesktopFiltersBar' }
);

type Props = {
    count: number;
    className?: string;
    showReset: boolean;
    onReset: () => void;
};

export const DesktopFiltersBar: FC<Props> = props => {
    const { className, showReset, onReset, count } = props;
    const classes = useStyles();
    const { t } = useTranslation();

    return (
        <div className={clsx(classes.root, className)}>
            <div className={classes.container}>
                <div className={classes.filtersCount}>
                    {t('search:filtersSelected')}: {count}
                </div>

                {showReset ? (
                    <Button
                        className={classes.resetButton}
                        color="primary"
                        onClick={onReset}
                    >
                        {t('search:filtersReset')}
                    </Button>
                ) : null}
            </div>
        </div>
    );
};
