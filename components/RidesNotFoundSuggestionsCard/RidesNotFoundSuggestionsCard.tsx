import React, { FC } from 'react';
import * as Sentry from '@sentry/browser';
import clsx from 'clsx';
import parseISO from 'date-fns/parseISO';
import { Severity } from '@sentry/browser';
import { makeStyles, Theme } from '@material-ui/core/styles';
import { useRouter } from 'next/router';
import { useDispatch, useSelector } from 'react-redux';

import {
    LastSearchState,
    SearchQuery,
    LastSearch,
} from 'store/last-search/types';
import { NearDateButton } from './NearDateButton';
import { RootState } from 'store';
import { SearchRidesState } from 'store/search-rides/types';
import { Typo } from 'components/Typo/Typo';
import { changeSearchForm } from 'store/search-form/actions';
import { excludeCurrentDate } from 'utils/calendar';
import { fetchingRides } from 'store/search-rides/actions';
import { format } from 'utils/date';
import { isCordova } from 'utils/platform';
import { routerPushSeoPage } from 'utils/routerPushSeoPage';
import { useSeoPrefix } from 'hooks/useSeoPrefix';
import { useTranslation } from 'i18n';
import { AtlasTheme } from 'typings/atlas-theme';
import { useSAAS } from 'hooks/useSAAS';

const useStyles = makeStyles(
    (theme: Theme & AtlasTheme) => ({
        /* Styles applied to the root element. */
        root: {
            backgroundColor: theme.palette.common.white,
            boxShadow: theme.atlas.shadows.bottom,
            borderRadius: theme.atlas.borderRadius.light,
            padding: theme.spacing(2),
        },
        title: {
            fontWeight: 600,
        },
        desc: {
            marginTop: theme.spacing(1),
        },
        actions: {
            marginTop: theme.spacing(2),
        },
        nearDateButtonGroupContainer: {
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'center',
        },
        nearDateButton: {
            margin: theme.spacing(0.5),
        },
    }),
    { name: 'RidesNotFoundSuggestionsCard' }
);

type RidesNotFoundSuggestionsCardProps = {
    className?: string;
    /**
     * Limit number of date buttons.
     */
    limit?: number;
};

export const RidesNotFoundSuggestionsCard: FC<
    RidesNotFoundSuggestionsCardProps
> = props => {
    const { className, limit = 5 } = props;
    const classes = useStyles();
    const { t } = useTranslation();
    const router = useRouter();
    const dispatch = useDispatch();
    const { isMioTaxi } = useSAAS();

    const { seoPrefix } = useSeoPrefix();

    const { calendar } = useSelector<RootState, SearchRidesState>(
        rootState => rootState.searchRides
    );

    const { lastSearch } = useSelector<RootState, LastSearchState>(
        rootState => rootState.lastSearch
    );

    if (!lastSearch) {
        return null;
    }

    const calendarItems = excludeCurrentDate(calendar, lastSearch.date);
    const lastSearchDateFormatted = format(parseISO(lastSearch.date), 'd MMMM');

    const handleDateButtonClick = (newDate: string) => {
        if (!lastSearch) {
            const message =
                '[RidesNotFoundSuggestionsCard] Missing store.lastSearch';

            console.warn(message);
            Sentry.captureMessage(message, Severity.Critical);
            return;
        }
        const { from, to, passengers, time } = lastSearch;

        if (isCordova) {
            // Эта хрень может запутать. Оно просто работает.
            // Скопировал из `Search.cordova.tsx`, метод `handleCalendarChange`.
            dispatch(
                changeSearchForm({
                    date: newDate,
                })
            );
            const queryObj: SearchQuery = {
                from: from.id,
                to: to.id,
                date: newDate,
                passengers,
                fromName: from.name,
                toName: to.name,
            };
            if (time) {
                queryObj['time'] = time;
            }
            router.push(
                {
                    pathname: '/search',
                    query: queryObj,
                },
                undefined,
                { shallow: true }
            );
            dispatch(fetchingRides());
        } else {
            const queryObj: LastSearch = {
                from,
                to,
                date: newDate,
                passengers,
            };
            if (time) {
                queryObj['time'] = time;
            }
            routerPushSeoPage(router, queryObj, seoPrefix);
        }
    };

    const today = new Date();
    const tomorrow = new Date().setDate(today.getDate() + 1);

    const todayFormatted = format(today, 'yyyy-MM-dd');
    const tomorrowFormatted = format(tomorrow, 'yyyy-MM-dd');

    const isLastSearchEqualCurrentDay = lastSearch.date === todayFormatted;

    if (isMioTaxi) {
        return (
            <div className={clsx(classes.root, className)}>
                <Typo
                    className={classes.title}
                    variant="header2"
                    align="center"
                >
                    {t('ridesNotFoundTitleTaxi')}
                </Typo>

                <Typo className={classes.desc} variant="body4" align="center">
                    {t(
                        isLastSearchEqualCurrentDay
                            ? 'ridesNotFoundDescTodayTaxi'
                            : 'ridesNotFoundDescTomorrowTaxi',
                        {
                            date: lastSearchDateFormatted,
                        }
                    )}
                </Typo>

                {isLastSearchEqualCurrentDay && (
                    <div className={classes.actions}>
                        <div className={classes.nearDateButtonGroupContainer}>
                            <NearDateButton
                                className={classes.nearDateButton}
                                onClick={() =>
                                    handleDateButtonClick(tomorrowFormatted)
                                }
                            >
                                Предзаказать Мио на завтра
                            </NearDateButton>
                        </div>
                    </div>
                )}
            </div>
        );
    }

    return (
        <div className={clsx(classes.root, className)}>
            <Typo className={classes.title} variant="header2" align="center">
                {t('ridesNotFoundTitle')}
            </Typo>

            <Typo className={classes.desc} variant="body4" align="center">
                {t('ridesNotFoundDesc', {
                    date: lastSearchDateFormatted,
                })}
            </Typo>

            <div className={classes.actions}>
                <div className={classes.nearDateButtonGroupContainer}>
                    {calendarItems.slice(0, limit).map(item => (
                        <NearDateButton
                            className={classes.nearDateButton}
                            key={item.date}
                            onClick={() => handleDateButtonClick(item.date)}
                        >
                            {format(parseISO(item.date), 'd MMMM')}
                        </NearDateButton>
                    ))}
                </div>
            </div>
        </div>
    );
};
