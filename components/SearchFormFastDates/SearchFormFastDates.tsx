import React, { FC } from 'react';
import addDays from 'date-fns/addDays';
import { makeStyles } from '@material-ui/core/styles';
import { useSelector } from 'react-redux';

import { RootState } from 'store';
import { SearchFormFastDateItem } from './SearchFormFastDateItem';
import { SearchFormState } from 'store/search-form/types';
import { format } from 'utils/date';
import { searchFormHintsHeight } from 'components/SearchFormHints';
import { useTranslation } from 'i18n';

const useStyles = makeStyles(
    () => ({
        /* Styles applied to the root element. */
        root: {
            height: searchFormHintsHeight,
        },
        item: {
            color: '#FFF',
        },
    }),
    { name: 'SearchFormFastDates' }
);

export const SearchFormFastDates: FC = () => {
    const classes = useStyles();
    const { t } = useTranslation();
    const { fromValue: from, toValue: to } = useSelector<
        RootState,
        SearchFormState
    >(rootState => rootState.searchForm);

    // Если форма не заполнена мы не можем сформировать URL
    if (!from || !to) {
        return null;
    }

    const tomorrow = format(addDays(new Date(), 1), 'yyyy-MM-dd');
    const afterTomorrow = format(addDays(new Date(), 2), 'yyyy-MM-dd');

    return (
        <div className={classes.root}>
            <SearchFormFastDateItem
                date={tomorrow}
                text={t('fastDateTomorrow')}
            />
            <SearchFormFastDateItem
                date={afterTomorrow}
                text={t('fastDateAfterTomorrow')}
            />
        </div>
    );
};
