import React, { FC } from 'react';
import upperFirst from 'lodash/upperFirst';
import { makeStyles, Theme } from '@material-ui/core/styles';
import { useDispatch } from 'react-redux';

import { Button } from '../ui/Button';
import { ButtonGroup } from '../ui/ButtonGroup';
import { FiltersSortBy } from 'store/filters/types';
import { sortByFilters } from 'store/filters/actions';
import { useTranslation } from 'i18n';

const useStyles = makeStyles(
    (theme: Theme) => ({
        /* Styles applied to the root element. */
        root: {},
        /* Styles applied to the `Button` component. */
        button: {
            // не помещается текст "По стоимости" внутри кнопки на десктопе
            padding: 0,
            borderRadius: '100px',
        },
    }),
    { name: 'SortbyButtonGroup' }
);

type Props = {
    sortBy: FiltersSortBy | null;
};

const sortByValues: FiltersSortBy[] = ['time', 'price'];

export const SortbyButtonGroup: FC<Props> = props => {
    const { sortBy } = props;
    const classes = useStyles();
    const { t } = useTranslation();
    const dispatch = useDispatch();

    const handleSortBy = (sortBy: FiltersSortBy) => () => {
        dispatch(sortByFilters(sortBy));
    };

    return (
        <ButtonGroup variant="outlined" color="primary" size="small" fullWidth>
            {sortByValues.map(value => (
                <Button
                    className={classes.button}
                    height="100%"
                    key={value}
                    onClick={handleSortBy(value)}
                    variant={value === sortBy ? 'contained' : 'outlined'}
                >
                    {t(`search:sortBy${upperFirst(value)}`)}
                </Button>
            ))}
        </ButtonGroup>
    );
};
