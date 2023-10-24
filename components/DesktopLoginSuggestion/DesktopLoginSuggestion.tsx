import React, { FC } from 'react';
import CircularProgress from '@material-ui/core/CircularProgress';
import Grid from '@material-ui/core/Grid';
import clsx from 'clsx';
import { makeStyles, Theme } from '@material-ui/core/styles';

import { LoginSuggestDialog } from '../LoginSuggestDialog';
import { PhoneInput } from '../PhoneInput';
import { Typo } from '../Typo/Typo';
import { useLoginSuggest } from 'hooks/useLoginSuggest';
import { useTranslation } from 'i18n';
import { AtlasTheme } from 'typings/atlas-theme';
import { useSAAS } from 'hooks/useSAAS';
import { useSelector } from 'react-redux';
import { RootState } from 'store';
import { BookingState } from 'store/booking/types';
import { checkValidPhone } from 'utils/phone';

const useStyles = makeStyles(
    (theme: Theme & AtlasTheme) => ({
        /* Styles applied to the root element. */
        root: {
            backgroundColor: '#FFF',
            padding: theme.spacing(3),
            borderRadius: theme.shape.borderRadius,
            boxShadow: theme.atlas.shadows.bottom,
        },
        /* Styles applied to the container `div` element. */
        container: {},
        /* Styles applied to the hint `div` element. */
        hint: {
            marginTop: theme.spacing(1),
        },
    }),
    { name: 'DesktopLoginSuggestion' }
);

type Props = {
    className?: string;
};

export const DesktopLoginSuggestion: FC<Props> = props => {
    const { className } = props;
    const classes = useStyles();
    const { t } = useTranslation();
    const { isMioTaxi } = useSAAS();
    const {
        phone,
        phoneLoading,
        phoneSuggestDialog,
        onPhoneChange,
        handlePhoneSuggestClose,
    } = useLoginSuggest();

    const { firePhoneValidate } = useSelector<RootState, BookingState>(
        rootState => rootState.booking
    );

    const [hasPhoneError, setHasPhoneError] = React.useState(false);
    React.useEffect(() => {
        if (firePhoneValidate) {
            checkValidPhone(phone)
                ? setHasPhoneError(false)
                : setHasPhoneError(true);
        }
    }, [firePhoneValidate, phone]);

    return (
        <div className={clsx(classes.root, className)}>
            <Grid container spacing={2}>
                <Grid item xs={12} sm={4} md={4}>
                    {t('booking:contactNumber')}
                </Grid>
                <Grid item xs={12} sm={8} md={8}>
                    <PhoneInput
                        placeholder={t('booking:contactNumber')}
                        fullWidth
                        value={phone}
                        onPhoneChange={onPhoneChange}
                        InputProps={{
                            endAdornment: phoneLoading ? (
                                <CircularProgress color="inherit" size={18} />
                            ) : null,
                        }}
                        inputProps={{
                            inputMode: 'numeric',
                        }}
                        variant="outlined"
                        error={hasPhoneError}
                    />

                    <Typo
                        variant="caption"
                        color="textSecondary"
                        className={classes.hint}
                    >
                        {isMioTaxi
                            ? t('booking:contactNumberDescTaxi')
                            : t('booking:contactNumberDesc')}
                    </Typo>
                </Grid>
            </Grid>

            <LoginSuggestDialog
                phone={phone}
                open={phoneSuggestDialog}
                onClose={handlePhoneSuggestClose}
            />
        </div>
    );
};
