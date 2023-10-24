import React, { FC } from 'react';
import dateFormat from 'date-fns/format';
import addDays from 'date-fns/addDays';
import parseISO from 'date-fns/parseISO';
import differenceInCalendarDays from 'date-fns/differenceInCalendarDays';
import Tabs from '@material-ui/core/Tabs';
import { makeStyles, Theme } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import clsx from 'clsx';

import { CalendarDto } from 'swagger/client';
import { CurrencySymbol } from 'utils/currency';
import { PriceCalendarItem } from './PriceCalendarItem';
import { PriceCalendarShimmer } from './PriceCalendarShimmer';
import { Typo } from 'components/Typo/Typo';
import { usePlatform } from 'hooks/usePlatform';
import { useTranslation } from 'i18n';

const useStyles = makeStyles(
    (theme: Theme) => ({
        /* Styles applied to the root element. */
        root: {
            height: 85,
            backgroundColor: '#FFF',
        },
        tabsContainer: {
            alignItems: 'center',
        },
        tabsIndicator: {
            height: 4,
        },
        divider: {
            width: 1,
            height: 50,
            backgroundColor: theme.palette.divider,
            flexShrink: 0,
        },
        wrapper: {
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
        },
        calendarTitle: {
            width: 150,
            paddingRight: theme.spacing(2),
        },
        scrollButton: {
            zIndex: 3,
            '&::after': {
                content: "' '",
                width: 20,
                height: 85,
                zIndex: 2,
                background:
                    'linear-gradient(90deg, rgba(255,255,255,1) 0%, rgba(255,255,255,1) 50%, rgba(255,255,255,0) 100%)',
                marginRight: -20,
            },
            '&::before': {
                content: "' '",
                width: 20,
                height: 85,
                zIndex: 2,
                background:
                    'linear-gradient(90deg, rgba(255,255,255,0) 0%, rgba(255,255,255,1) 50%, rgba(255,255,255,1) 100%)',
                marginLeft: -20,
            },
        },
        shimmers: {
            display: 'flex',
            overflow: 'hidden',
        },
        shimmersDesktop: {
            marginLeft: 40,
        },
    }),
    { name: 'PriceCalendar' }
);

type Props = {
    value?: string; // ISO
    onChange?: (value: string) => void;
    calendar: CalendarDto[];
    loading?: boolean;
};

export const PriceCalendar: FC<Props> = React.memo(props => {
    const { calendar, value, onChange, loading } = props;
    const classes = useStyles();
    const { isDesktop } = usePlatform();

    const selectedDate = value ? new Date(value) : new Date();

    const handleChange = (event: React.ChangeEvent<{}>, newValue: string) => {
        if (onChange) {
            onChange(newValue);
        }
    };

    const Wrapper = (props: any) => {
        if (isDesktop) {
            return <Container {...props} />;
        }
        return <div {...props} />;
    };
    const { t } = useTranslation();

    return (
        <div className={classes.root}>
            <Wrapper className={classes.wrapper}>
                {isDesktop && (
                    <div>
                        <Typo className={classes.calendarTitle} weight="bold">
                            {t('search:calendarTitle')}
                        </Typo>
                    </div>
                )}

                {loading ? (
                    <div
                        className={clsx(classes.shimmers, {
                            [classes.shimmersDesktop]: isDesktop,
                        })}
                    >
                        {Array(7)
                            .fill('')
                            .map((v, k) => (
                                <PriceCalendarShimmer key={k} />
                            ))}
                    </div>
                ) : (
                    <Tabs
                        value={value}
                        onChange={handleChange}
                        indicatorColor="primary"
                        textColor="primary"
                        variant="scrollable"
                        scrollButtons="auto"
                        classes={{
                            indicator: classes.tabsIndicator,
                            flexContainer: classes.tabsContainer,
                            scrollButtons: classes.scrollButton,
                        }}
                    >
                        {fillCalendarGaps(calendar, selectedDate).map(
                            (item, index) => [
                                index > 0 && (
                                    <div className={classes.divider} />
                                ),
                                <PriceCalendarItem
                                    key={item.date}
                                    value={item.date}
                                    price={getPrice(item)}
                                    priceLow={isLowestPrice(item, calendar)}
                                    priceHigh={isHighestPrice(item, calendar)}
                                    currency={getCurrency(item)}
                                    date={item.date}
                                />,
                            ]
                        )}
                    </Tabs>
                )}
            </Wrapper>
        </div>
    );
});

/**
 * Нормализует календарь.
 * Заполнит гэпы между датами.
 *
 * @param calendar
 * @param selectedDate
 */
function fillCalendarGaps(
    calendar: CalendarDto[],
    selectedDate: Date
): CalendarDto[] {
    const todayDate = new Date();

    const startCalendar = calendar[0];
    const endCalendar = calendar[calendar.length - 1];

    const startDate = startCalendar ? parseISO(startCalendar.date) : todayDate;
    const endDate = endCalendar
        ? parseISO(endCalendar.date)
        : addDays(startDate, 5);

    const diffDays = differenceInCalendarDays(endDate, startDate);

    const daysRange: Array<string> = [];
    for (let i = 0; i <= diffDays; i++) {
        daysRange.push(dateFormat(addDays(startDate, i), 'yyyy-MM-dd'));
    }
    const calendarRange: Array<CalendarDto> = daysRange.map(
        d =>
            calendar.find(c => c.date === d) || {
                byPartner: {},
                date: d,
                minPrices: [],
                rideCount: 0,
                type: 'valid',
            }
    );
    return calendarRange;
}

function isLowestPrice(item: CalendarDto, calendar: CalendarDto[]): boolean {
    const price = getPrice(item);

    return calendar.every(calendarItem => {
        const calendarPrice = getPrice(calendarItem);

        return calendarPrice >= price || calendarPrice === 0;
    });
}

function isHighestPrice(item: CalendarDto, calendar: CalendarDto[]): boolean {
    return calendar.every(
        calendarItem => getPrice(calendarItem) <= getPrice(item)
    );
}

function getPrice(item: CalendarDto): number {
    const { minPrices } = item;

    return (minPrices[0] && minPrices[0].price) || 0;
}

function getCurrency(item: CalendarDto): CurrencySymbol | undefined {
    const { minPrices } = item;

    return (
        (minPrices[0] && (minPrices[0].currency as CurrencySymbol)) || undefined
    );
}
