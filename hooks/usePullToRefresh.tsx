import React, { useEffect } from 'react';
import ReactDOMServer from 'react-dom/server';
import ArrowDownwardIcon from '@material-ui/icons/ArrowDownward';
import CircularProgress from '@material-ui/core/CircularProgress';
import { makeStyles, Theme } from '@material-ui/core/styles';

import { isCordova } from 'utils/platform';

const PullToRefreshJS =
    process.browser && isCordova ? require('pulltorefreshjs') : null;

const useStyles = makeStyles(
    (theme: Theme) => ({
        '@global': {
            '.ptr--ptr': {
                position: 'absolute !important',
                zIndex: theme.zIndex.drawer,
                boxShadow: 'none !important',
            },
        },
    }),
    { name: 'UsePullToRefresh' }
);

export function usePullToRefresh(onRefresh: Function, isSearch?: boolean) {
    useStyles();
    const color = isSearch ? 'white' : 'rgba(42, 95, 207, 0.88)';
    useEffect(() => {
        if (
            process.browser &&
            isCordova &&
            PullToRefreshJS &&
            (isSearch !== undefined ? isSearch : true)
        ) {
            PullToRefreshJS.init({
                mainElement: 'body',
                distReload: 80,
                distThreshold: 80,
                distMax: 120,
                onRefresh,
                instructionsPullToRefresh: ' ',
                instructionsReleaseToRefresh: ' ',
                instructionsRefreshing: ' ',
                iconArrow: ReactDOMServer.renderToString(
                    <ArrowDownwardIcon style={{ color: color }} />
                ),
                iconRefreshing: ReactDOMServer.renderToString(
                    <CircularProgress style={{ color: color }} size={24} />
                ),
            });

            return () => {
                PullToRefreshJS.destroyAll();
            };
        }
    }, [isSearch]);
}
