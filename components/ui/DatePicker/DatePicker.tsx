import React, { FC, ReactElement } from 'react';
import clsx from 'clsx';
import isWeekend from 'date-fns/isWeekend';
import isEqual from 'date-fns/isEqual';
import isToday from 'date-fns/isToday';
import isBefore from 'date-fns/isBefore';
import IconButton from '@material-ui/core/IconButton';
import KeyboardArrowLeftIcon from '@material-ui/icons/KeyboardArrowLeft';
import KeyboardArrowRightIcon from '@material-ui/icons/KeyboardArrowRight';
import {
    DatePicker as BaseDatePicker,
    DatePickerProps,
} from '@material-ui/pickers';

import { useStyles } from './styles';
import { format } from 'utils/date';

type Props = DatePickerProps;

export const DatePicker: FC<Props> = props => {
    const { value, onChange, onAccept = () => {}, ...rest } = props;
    const classes = useStyles();

    const renderDay = (
        day: Date | null,
        selectedDate: Date | null,
        dayInCurrentMonth: boolean
    ): ReactElement => {
        const isWeekendDay = day ? isWeekend(day) : false;
        const isSelectedDate =
            day && selectedDate ? isEqual(day, selectedDate) : false;
        const isDateToday = day ? isToday(day) : false;
        const isDateInPast = day
            ? isBefore(day, Date.now()) && !isDateToday
            : false;

        const wrapperClassName = clsx({
            [classes.weekend]: isWeekendDay,
        });

        const dayClassName = clsx(classes.day, {
            [classes.selectedDate]: isSelectedDate,
            [classes.nonCurrentMonthDay]: !dayInCurrentMonth,
            [classes.today]: isDateToday,
            [classes.past]: isDateInPast,
        });

        const handleDayClick = () => {
            if (!dayInCurrentMonth && !isDateInPast) {
                onChange(day);
                onAccept(day);
            }
        };

        return (
            <div className={wrapperClassName}>
                <IconButton
                    onClick={handleDayClick}
                    className={dayClassName}
                    disableRipple
                >
                    {day ? <span>{format(day, 'd')}</span> : null}
                </IconButton>
            </div>
        );
    };

    return (
        <div className={classes.root}>
            <BaseDatePicker
                value={value}
                onChange={onChange}
                onAccept={onAccept}
                variant="static"
                format="d MMMM"
                disableToolbar
                renderDay={renderDay}
                leftArrowIcon={<KeyboardArrowLeftIcon color="primary" />}
                rightArrowIcon={<KeyboardArrowRightIcon color="primary" />}
                {...rest}
            />
        </div>
    );
};
