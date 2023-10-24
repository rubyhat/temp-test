import React, {
    ChangeEvent,
    FC,
    ReactNode,
    useCallback,
    useEffect,
    useRef,
    useState,
} from 'react';
import CircularProgress from '@material-ui/core/CircularProgress';
import Countdown from 'react-countdown';
import Grid from '@material-ui/core/Grid';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import CheckIcon from '@material-ui/icons/Check';
import ReCAPTCHA from 'react-google-recaptcha';
import { makeStyles, Theme } from '@material-ui/core/styles';
import { useDispatch, useSelector } from 'react-redux';
import clsx from 'clsx';

import {
    AuthState,
    LOGIN,
    LOGIN_ERROR,
    LOGIN_SUCCESS,
    SEND_CODE_ERROR,
    SEND_CODE_SUCCESS,
    SEND_CODE_TOO_MANY_REQUESTS,
} from 'store/auth/types';
import useSnackBar from '../ui/Snackbar/useSnackbar';
import { Button } from '../ui/Button';
import { Checkbox } from '../ui/Checkbox/Checkbox';
import {
    authReset,
    login,
    registerNewUser,
    sendCode,
    updateAuthData,
} from 'store/auth/actions';
import { PhoneInput } from '../PhoneInput';
import { RootState } from 'store';
import { TextField } from '../ui/TextField/TextField';
import { Typo } from '../Typo/Typo';
import { checkValidPhone, formatPhone } from 'utils/phone';
import { useTranslation } from 'i18n';
import { formatTime } from 'utils/time';
import { CountryState } from 'store/country/types';
import { countryCodes } from 'utils/country';
import { useSAAS } from 'hooks/useSAAS';
import apiClient from 'lib/apiClient';
import { SignUpProviderResponseDtoProviderEnum } from 'swagger/client';
import { RecaptchaState } from 'store/auth-recaptcha/types';
import { AtlasTheme } from 'typings/atlas-theme';

const useStyles = makeStyles(
    (theme: Theme & AtlasTheme) => ({
        /* Styles applied to the root element. */
        root: {
            backgroundColor: '#FFF',
            padding: theme.spacing(2),
            display: 'flex',
            flexDirection: 'row-reverse',
            alignItems: 'center',
        },
        /* Styles applied to the header `div` element. */
        header: {
            marginBottom: theme.spacing(5),
        },
        /* Styles applied to the phone number `span` element. */
        phoneNumber: {
            whiteSpace: 'nowrap',
        },
        /* Styles applied to the actions `div` element. */
        actions: {
            marginTop: theme.spacing(3),
        },
        /* Styles applied to the remember me `Checkbox` component. */
        checkbox: {
            textAlign: 'center',
            paddingTop: theme.spacing(3),
        },
        /* Styles applied to the login and forgot password buttons. */
        button: {
            '& ~ &': {
                marginTop: theme.spacing(2),
            },
        },
        promo: {},
        promoItem: {
            display: 'flex',
            flexDirection: 'row',
            marginBottom: theme.spacing(1),
            '& > .MuiSvgIcon-root': {
                marginRight: theme.spacing(1),
            },
        },
        form: {
            flex: 1,
        },
        '@global': {
            '.grecaptcha-badge': {
                visibility: 'visible',
                bottom: 70,
            },
        },
    }),
    { name: 'LoginForm' }
);

export type Props = {
    header?: ReactNode;
    actions?: ReactNode;
    loginButtonText?: string;
    onLogin?: () => void;
    disableRememberMe?: boolean;
    disableForgotPassword?: boolean;
    disablePhoneInput?: boolean;
    autocompleteCountryCode?: boolean;
    className?: string;
    showPromo?: boolean;
};

export const LoginForm: FC<Props> = props => {
    const {
        header = null,
        actions = null,
        loginButtonText = '',
        onLogin = () => {},
        disableRememberMe,
        disableForgotPassword,
        disablePhoneInput,
        autocompleteCountryCode,
        className,
        showPromo = true,
    } = props;
    const classes = useStyles();
    const dispatch = useDispatch();
    const {
        status,
        phoneNumber,
        smsCode,
        remember,
        nextMessage,
        codeLength,
    } = useSelector<RootState, AuthState>(rootState => rootState.auth);
    const [, snackbar] = useSnackBar();
    const { t } = useTranslation();
    const { partnerName } = useSAAS();

    const { recaptchaKeys } = useSelector<RootState, RecaptchaState>(
        rootState => rootState.authRecaptcha
    );

    const handlePhoneNumberChange = (phoneNumber: string) =>
        dispatch(updateAuthData({ phoneNumber }));
    const handleSmsCodeChange = (e: React.ChangeEvent<HTMLInputElement>) =>
        dispatch(updateAuthData({ smsCode: e.target.value }));

    const onRememberChange = (
        event: ChangeEvent<HTMLInputElement>,
        checked: boolean
    ) => {
        dispatch(updateAuthData({ remember: checked }));
    };

    const [countdownDate, setCountdownDate] = useState(Date.now());
    const resetCountdown = () =>
        setCountdownDate(Date.now() + nextMessage * 1000);

    const recaptchaRef = useRef<ReCAPTCHA>(null);
    const firebaseRecaptchaRef = useRef<ReCAPTCHA>(null);
    const [captchaToken, setCaptchaToken] = useState<string | null>(null);
    const [useFirebase, setUseFirebaseAuth] = useState(false);

    const executeCaptcha = async (phoneNumber: string) => {
        const authProvider = await apiClient.authProvider(phoneNumber);
        const captchaRef =
            authProvider === SignUpProviderResponseDtoProviderEnum.Firebase
                ? firebaseRecaptchaRef
                : recaptchaRef;
        if (authProvider === SignUpProviderResponseDtoProviderEnum.Firebase) {
            setUseFirebaseAuth(true);
        } else {
            setUseFirebaseAuth(false);
        }
        if (captchaRef.current) {
            captchaRef.current.execute();
        }
    };
    const resetCaptcha = () => {
        if (recaptchaRef.current) {
            recaptchaRef.current.reset();
        }
        if (firebaseRecaptchaRef.current) {
            firebaseRecaptchaRef.current.reset();
        }
    };
    const handleSendCode = useCallback(async () => {
        if (checkValidPhone(phoneNumber)) {
            await executeCaptcha(phoneNumber);
        } else {
            snackbar({
                type: 'show',
                payload: {
                    message: t('auth:incorrectPhoneNumber'),
                    variant: 'alert',
                },
            });
        }
    }, [phoneNumber]);
    const handleResendCode = () => {
        dispatch(updateAuthData({ smsCode: '' }));
        resetCaptcha();
        executeCaptcha(phoneNumber);
    };
    const handleCaptchaChange = (token: string | null, ...args: any) => {
        if (token) {
            setCaptchaToken(token);
        }
    };

    useEffect(() => {
        if (captchaToken) {
            dispatch(sendCode(captchaToken, useFirebase));
        }
    }, [captchaToken]);

    useEffect(() => {
        if (smsCode.length >= codeLength) {
            dispatch(login());
        }
    }, [smsCode]);

    useEffect(() => {
        if (status === LOGIN_SUCCESS) {
            snackbar({
                type: 'show',
                payload: {
                    message: t('auth:loginSuccess'),
                },
            });

            onLogin();
            dispatch(authReset());
            dispatch(registerNewUser());
        } else if (status === SEND_CODE_ERROR) {
            snackbar({
                type: 'show',
                payload: {
                    variant: 'alert',
                    message: t('auth:sendCodeError'),
                },
            });
        } else if (status === SEND_CODE_TOO_MANY_REQUESTS) {
            snackbar({
                type: 'show',
                payload: {
                    variant: 'alert',
                    message: t('auth:sendCodeTooManyRequests', {
                        count: Math.ceil(nextMessage / 60),
                    }),
                },
            });
        } else if (status === LOGIN_ERROR) {
            snackbar({
                type: 'show',
                payload: {
                    variant: 'alert',
                    message: t('auth:incorrectSmsCode'),
                },
            });
        }
    }, [status, nextMessage]);

    useEffect(() => {
        if (
            status === SEND_CODE_SUCCESS ||
            status === SEND_CODE_TOO_MANY_REQUESTS
        ) {
            resetCountdown();
        }
    }, [status]);

    useEffect(() => {
        if (
            status === SEND_CODE_ERROR ||
            status === SEND_CODE_TOO_MANY_REQUESTS
        ) {
            resetCaptcha();
        }
    }, [status]);

    const { country } = useSelector<RootState, CountryState>(
        rootState => rootState.country
    );
    useEffect(() => {
        if (autocompleteCountryCode) {
            const countryCode = countryCodes[country];
            if (!phoneNumber) {
                dispatch(updateAuthData({ phoneNumber: countryCode }));
            }
        }
    }, [country, autocompleteCountryCode]);

    const renderLoginStep = () => (
        <>
            {header ? <div className={classes.header}>{header}</div> : null}

            {!disablePhoneInput ? (
                <PhoneInput
                    value={phoneNumber}
                    defaultCountry={country}
                    onPhoneChange={handlePhoneNumberChange}
                    label={t('auth:phoneNumber')}
                    fullWidth
                    inputProps={{
                        inputMode: 'numeric',
                        autoFocus: true,
                    }}
                />
            ) : null}

            {!disableRememberMe ? (
                <div className={classes.checkbox}>
                    <FormControlLabel
                        control={
                            <Checkbox
                                color="primary"
                                checked={remember}
                                onChange={onRememberChange}
                            />
                        }
                        label={
                            <Typo variant="body1" color="textPrimary">
                                {t('auth:rememberMe')}
                            </Typo>
                        }
                    />
                </div>
            ) : null}

            <div className={classes.actions}>
                {actions}

                <Button
                    className={classes.button}
                    variant="contained"
                    color="primary"
                    fullWidth
                    onClick={handleSendCode}
                >
                    {loginButtonText || t('loginOrSignUp')}
                </Button>
                {!disableForgotPassword ? (
                    <Button
                        className={classes.button}
                        variant="outlined"
                        color="primary"
                        fullWidth
                    >
                        {t('auth:forgotPassword')}
                    </Button>
                ) : null}
            </div>
        </>
    );

    const renderConfirmationStep = () => (
        <>
            <div className={classes.header}>
                <Typo variant="subtitle" weight="bold" align="center">
                    {t('auth:codeSentToNumber')}{' '}
                    <span className={classes.phoneNumber}>
                        {formatPhone(phoneNumber)}
                    </span>
                </Typo>
            </div>

            <TextField
                value={smsCode}
                onChange={handleSmsCodeChange}
                label={t('auth:enterCode')}
                fullWidth
                type="number"
                InputProps={{
                    endAdornment:
                        status === LOGIN ? (
                            <CircularProgress color="inherit" size={18} />
                        ) : null,
                }}
                inputProps={{
                    autofill: 'one-time-code',
                    inputMode: 'numeric',
                    pattern: '[0-9]*',
                    autoFocus: true,
                }}
            />

            <div className={classes.actions}>
                <Countdown
                    key={countdownDate}
                    date={countdownDate}
                    autoStart
                    renderer={({ minutes, seconds, completed }) => {
                        if (completed) {
                            return (
                                <Button
                                    onClick={handleResendCode}
                                    className={classes.button}
                                    variant="text"
                                    color="primary"
                                    fullWidth
                                >
                                    {t('auth:resendCode')}
                                </Button>
                            );
                        }

                        return (
                            <Typo color="textSecondary" align="center">
                                {t('auth:newCodeTimeout')}{' '}
                                {formatTime(seconds + minutes * 60)}
                            </Typo>
                        );
                    }}
                />
            </div>
        </>
    );

    const promoItems = [
        t('auth:loginPromoFeature1'),
        t('auth:loginPromoFeature2'),
        t('auth:loginPromoFeature3'),
    ];

    return (
        <div className={clsx(classes.root, className)}>
            {recaptchaKeys && (
                <ReCAPTCHA
                    ref={recaptchaRef}
                    size="invisible"
                    sitekey={recaptchaKeys.atlasSiteKey}
                    onChange={handleCaptchaChange}
                />
            )}
            {recaptchaKeys && (
                <ReCAPTCHA
                    ref={firebaseRecaptchaRef}
                    size="invisible"
                    sitekey={recaptchaKeys.firebaseSiteKey}
                    onChange={handleCaptchaChange}
                />
            )}
            <Grid container spacing={4}>
                <Grid item md={showPromo ? 6 : 12} className={classes.form}>
                    <div>
                        {status === LOGIN_SUCCESS
                            ? null
                            : status === null ||
                              status === SEND_CODE_ERROR ||
                              status === SEND_CODE_TOO_MANY_REQUESTS
                            ? renderLoginStep()
                            : renderConfirmationStep()}
                    </div>
                </Grid>
                {showPromo && (
                    <Grid item md={6} className={classes.promo}>
                        <div>
                            <Typo variant="caption">
                                {t('brand:loginPromoTitle', {
                                    context: partnerName,
                                })}
                            </Typo>
                            <p>
                                {promoItems.map(i => (
                                    <div className={classes.promoItem} key={i}>
                                        <CheckIcon color="primary" />
                                        <Typo variant="body1">{i}</Typo>
                                    </div>
                                ))}
                            </p>
                        </div>
                    </Grid>
                )}
            </Grid>
        </div>
    );
};
