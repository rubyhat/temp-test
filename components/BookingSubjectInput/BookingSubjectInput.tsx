import React, { ChangeEvent, FC } from 'react';
import { makeStyles, Theme } from '@material-ui/core/styles';
import { useDispatch, useSelector } from 'react-redux';
import { OutlinedTextFieldProps } from '@material-ui/core/TextField';

import { RootState } from 'store';
import { TextField } from 'components/ui/TextField/TextField';
import { bookingEditSubject } from 'store/booking/actions';
import { useTranslation } from 'i18n';

const useStyles = makeStyles(
    (theme: Theme) => ({
        /* Styles applied to the root element. */
        root: {},
    }),
    { name: 'BookingSubjectInput' }
);

type Props = {
    TextFieldProps?: OutlinedTextFieldProps;
};

export const BookingSubjectInput: FC<Props> = props => {
    const { TextFieldProps } = props;
    const classes = useStyles();
    const { t } = useTranslation();
    const dispatch = useDispatch();

    const subject = useSelector<RootState, string>(
        rootState => rootState.booking.subject
    );

    const handleChange = (
        e: ChangeEvent<HTMLTextAreaElement | HTMLInputElement>
    ) => {
        dispatch(bookingEditSubject(e.target.value));
    };

    return (
        <div className={classes.root}>
            <TextField
                value={subject}
                onChange={handleChange}
                label={t('booking:orderSubject')}
                multiline
                fullWidth
                rows={2}
                variant="outlined"
                {...TextFieldProps}
            />
        </div>
    );
};
