import React, { FC } from 'react';
import Chip from '@material-ui/core/Chip';
import FilterListIcon from '@material-ui/icons/FilterList';
import { makeStyles, Theme } from '@material-ui/core/styles';
import clsx from 'clsx';

import { Fab } from '../ui/Fab';
import { FiltersDialog } from '../FiltersDialog';
import { StopsDto } from 'swagger/client';
import { isCordova } from 'utils/platform';
import { useTranslation } from 'i18n';
import { usePlatform } from 'hooks/usePlatform';
import { AtlasTheme } from 'typings/atlas-theme';

const useStyles = makeStyles(
    (theme: Theme & AtlasTheme) => ({
        /* Styles applied to the root element. */
        root: {
            zIndex: theme.zIndex.appBar,
        },
        /* Styles applied to the filters `div` element. */
        filters: {
            position: 'fixed',
            left: 0,
            right: 0,
            bottom: 0,
            marginBottom: 16,
            ...theme.atlas.bottomBar.paddingBottom(0),
            textAlign: 'center',
            pointerEvents: 'none',
        },
        /* Pseudo-class applied to the filters `div` element if is Cordova. */
        filtersCordova: {
            bottom: 56, // @todo MobileBottomNavigation height
        },
        filtersFab: {
            pointerEvents: 'auto',
            // backgroundColor: theme.palette.primary.main,
            // color: theme.palette.primary.contrastText,
        },
        filtersCounter: {
            width: 24,
            marginRight: theme.spacing(1),
        },
        filtersPlaceholder: {
            marginTop: 16,
            marginBottom: 16,
            height: 56, // MobileBottomNavigation height
        },
        icon: {
            marginRight: theme.spacing(1),
            width: 24,
            height: 24,
        },
    }),
    { name: 'Filters' }
);

type Props = {
    onReset?: () => void;
    dischargeStops?: StopsDto[];
    pickupStops?: StopsDto[];
    count: number;

    open: boolean;
    onOpen: () => void;
    onClose: () => void;
    onSubmit: () => void;
};

export const Filters: FC<Props> = props => {
    const {
        onReset,
        dischargeStops = [],
        pickupStops = [],
        count,
        open,
        onOpen,
        onClose,
        onSubmit,
    } = props;
    const classes = useStyles();
    const { inWebView } = usePlatform();

    const { t } = useTranslation();

    return (
        <div className={classes.root}>
            <div
                className={clsx(classes.filters, {
                    [classes.filtersCordova]: isCordova || inWebView,
                })}
            >
                <Fab
                    onClick={onOpen}
                    variant="extended"
                    className={classes.filtersFab}
                >
                    {count ? (
                        <Chip
                            className={classes.filtersCounter}
                            color="primary"
                            label={count}
                            size="small"
                        />
                    ) : (
                        <div className={classes.icon}>
                            <FilterListIcon />
                        </div>
                    )}

                    {t('search:filters')}
                </Fab>

                <FiltersDialog
                    open={open}
                    dischargeStops={dischargeStops}
                    pickupStops={pickupStops}
                    onClose={onClose}
                    onSubmit={onSubmit}
                    onReset={onReset}
                />
            </div>

            <div className={classes.filtersPlaceholder} />
        </div>
    );
};
