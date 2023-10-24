import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import Checkbox from '@material-ui/core/Checkbox';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import { useStyles } from 'components/FeedbackForm/styles';
import { PhoneInput } from 'components/PhoneInput';
import { Typo } from 'components/Typo/Typo';
// import { Button } from 'components/ui/Button';
import { TextField } from 'components/ui/TextField/TextField';
import { useTranslation } from 'i18n';
import Link from 'next/link';
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from 'store';
import { CountryState } from 'store/country/types';
import { FeedbackFormData, WidgetState } from 'store/feedbackWidget/types';
import {
    feedbackFormUpdateState,
    sendFeedbackForm,
} from 'store/feedbackWidget/actions';
import apiClient from 'lib/apiClient';
import { checkValidPhone } from 'utils/phone';
import { CircularProgress } from '@material-ui/core';
import { countryCodes } from 'utils/country';
import { isCordova } from 'utils/platform';
import { UserState } from 'store/user/types';
import { BrandState } from 'store/brand/types';

interface FormTemplate {
    setStep: (v: number) => void;
}

export const FormTemplate = ({ setStep }: FormTemplate) => {
    const { t } = useTranslation();
    const classes = useStyles();
    const dispatch = useDispatch();

    const { country } = useSelector<RootState, CountryState>(
        rootState => rootState.country
    );
    const widgetState = useSelector<RootState, WidgetState>(
        rootState => rootState.widget
    );
    const { phoneNumber } = useSelector<RootState, UserState>(
        rootState => rootState.user
    );
    const { brandName } = useSelector<RootState, BrandState>(
        rootState => rootState.brand
    );
    const isLoggedIn = !!phoneNumber;
    const [isFormInvalid, setIsFormInvalid] = React.useState(true);

    const [formData, setFormData] = React.useState<FeedbackFormData>({
        firstname: '',
        lastname: '',
        mobile: '',
        email: '',
        domain: isCordova && !isLoggedIn ? 'app' : country,
        text: '',
        attachments: [],
        brandName,
    });

    React.useEffect(() => {
        dispatch(
            feedbackFormUpdateState({
                domain: isCordova && !isLoggedIn ? 'app' : country,
                brandName: brandName,
            })
        );
    }, [country, dispatch, isLoggedIn, brandName]);

    const handleFieldChange = (
        event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
        const value = event.target.value;
        const name = event.target.name;

        dispatch(
            feedbackFormUpdateState({
                [name]: value,
            })
        );
        setFormData((prev: any) => {
            const newValue = { ...prev };
            newValue[name] = value;
            return newValue;
        });
    };

    const fileInputRef = React.useRef<HTMLInputElement>(null);
    const handleFileDelete = () => {
        dispatch(
            feedbackFormUpdateState({
                attachments: [],
            })
        );
        if (fileInputRef && fileInputRef.current)
            fileInputRef.current.value = '';
    };

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const files = event.target.files;

        if (files && files[0]) {
            const file = files[0];
            const reader = new FileReader();
            reader.onload = (event: Event) => {
                if (
                    reader &&
                    event.target &&
                    typeof reader.result === 'string'
                ) {
                    const base64File = reader.result;
                    setFormData(prev => {
                        const newValue = { ...prev };
                        newValue.attachments = [
                            {
                                filename: file.name,
                                'mime-type': file.type,
                                data: base64File,
                                size: (file.size / (1024 * 1024)).toFixed(2),
                            },
                        ];
                        return newValue;
                    });

                    dispatch(
                        feedbackFormUpdateState({
                            attachments: [
                                {
                                    filename: file.name,
                                    'mime-type': file.type,
                                    data: base64File.split(',')[1],
                                    size: (file.size / (1024 * 1024)).toFixed(
                                        2
                                    ),
                                },
                            ],
                        })
                    );
                }
            };
            reader.readAsDataURL(file);
        }
    };

    const [checked, setChecked] = React.useState(true);
    const handleCheckboxChange = (event: React.ChangeEvent<HTMLInputElement>) =>
        setChecked(event.target.checked);

    const [phone, setPhone] = React.useState(countryCodes[country]);
    const handlePhoneChange = (phone: string) => {
        setPhone(phone);
        setFormData((prev: any) => {
            const newValue = { ...prev };
            newValue.mobile = phone;
            return newValue;
        });
        dispatch(
            feedbackFormUpdateState({
                mobile: phone.slice(1),
            })
        );
    };

    React.useEffect(() => {
        const { firstname, lastname, mobile, email, text } = formData;
        setIsFormInvalid(
            !Boolean(
                firstname &&
                    lastname &&
                    checkValidPhone(mobile) &&
                    email &&
                    text &&
                    checked
            )
        );
    }, [formData, checked]);

    const handleFormSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        dispatch(
            feedbackFormUpdateState({
                feedbackStatus: 'FEEDBACK_FORM_SENDING',
            })
        );
        apiClient
            .sendFeedbackForm(widgetState)
            .then(res => {
                dispatch(sendFeedbackForm());
                dispatch(
                    feedbackFormUpdateState({
                        feedbackStatus: 'FEEDBACK_FORM_SUCCESS',
                    })
                );
                setStep(2);
            })
            .catch(err => {
                console.log(err);
                dispatch(
                    feedbackFormUpdateState({
                        feedbackStatus: 'FEEDBACK_FORM_ERROR',
                    })
                );
                setStep(2);
            });
    };

    return (
        <form
            className={classes.form}
            onSubmit={event => handleFormSubmit(event)}
        >
            <Box className={classes.fieldWrap}>
                <Typo className={classes.label} as="p">
                    {t('zammadMessageNameLabel')}
                </Typo>
                <TextField
                    name="firstname"
                    variant="outlined"
                    fullWidth
                    value={formData.firstname}
                    onChange={event => handleFieldChange(event)}
                    required
                    className={classes.inputWrap}
                    placeholder={t('zammadMessageNamePlaceholder')}
                    autoFocus
                />
            </Box>

            <Box className={classes.fieldWrap}>
                <Typo className={classes.label} as="p">
                    {t('zammadMessageLastNameLabel')}
                </Typo>
                <TextField
                    name="lastname"
                    variant="outlined"
                    fullWidth
                    value={formData.lastname}
                    onChange={event => handleFieldChange(event)}
                    required
                    className={classes.inputWrap}
                    placeholder={t('zammadMessageLastNamePlaceholder')}
                />
            </Box>

            <Box className={classes.fieldWrap}>
                <Typo className={classes.label} as="p">
                    {t('zammadMessagePhoneLabel')}
                </Typo>
                <PhoneInput
                    name="mobile"
                    value={phone}
                    defaultCountry={country}
                    fullWidth
                    inputProps={{
                        inputMode: 'numeric',
                    }}
                    onPhoneChange={handlePhoneChange}
                    required
                    className={classes.inputWrap}
                    variant="outlined"
                    placeholder={t('zammadMessagePhonePlaceholder')}
                    autoFocus={false}
                />
            </Box>

            <Box className={classes.fieldWrap}>
                <Typo className={classes.label} as="p">
                    {t('zammadMessageEmailLabel')}
                </Typo>
                <TextField
                    name="email"
                    type="email"
                    fullWidth
                    value={formData.email}
                    onChange={event => handleFieldChange(event)}
                    required
                    className={classes.inputWrap}
                    variant="outlined"
                    placeholder={t('zammadMessageEmailPlaceholder')}
                />
            </Box>
            <Box className={classes.fieldWrap}>
                <Typo className={classes.label} as="p">
                    {t('zammadMessageTextLabel')}
                </Typo>
                <TextField
                    name="text"
                    variant="outlined"
                    fullWidth
                    value={formData.text}
                    onChange={event => handleFieldChange(event)}
                    required
                    className={classes.inputWrap}
                    multiline
                    rows={5}
                    placeholder={t('zammadMessageTextPlaceholder')}
                />
            </Box>
            <Box className={classes.fieldWrap}>
                <Button
                    component="label"
                    variant="outlined"
                    color="primary"
                    fullWidth
                    className={classes.fileButton}
                >
                    <img
                        className={classes.fileButtonIcon}
                        src="/static/img/help-banner/icon-upload-cloud.svg"
                        alt="delete file"
                    />
                    {t('zammadMessageFileLabel')}
                    <input
                        name="file"
                        type="file"
                        hidden
                        onChange={handleFileChange}
                        ref={fileInputRef}
                        accept="image/*,video/*"
                    />
                </Button>
            </Box>
            {widgetState.attachments.length > 0 &&
                widgetState.attachments.map((file, index) => (
                    <Box key={index} className={classes.fieldWrap}>
                        <Box className={classes.fileInfo}>
                            <Box>
                                <Typo className={classes.fileTitle}>
                                    {file.filename}
                                </Typo>
                                <Typo className={classes.fileSubtitle}>
                                    {file.size} Mb
                                </Typo>
                            </Box>
                            <Box>
                                <IconButton onClick={handleFileDelete}>
                                    <CloseIcon fontSize="small" />
                                </IconButton>
                            </Box>
                        </Box>
                    </Box>
                ))}
            <Box className={classes.fieldWrap}>
                <FormControlLabel
                    control={
                        <Checkbox
                            checked={checked}
                            onChange={handleCheckboxChange}
                            color="primary"
                        />
                    }
                    label={
                        <Typo
                            color="textPrimary"
                            className={classes.checkboxLink}
                        >
                            {t('zammadAgreementMessage')}{' '}
                            <Typo
                                component="span"
                                onClick={() =>
                                    dispatch(
                                        feedbackFormUpdateState({
                                            isOpen: false,
                                        })
                                    )
                                }
                            >
                                <Link href="/privacy">
                                    {t('zammadAgreementMessageLink')}
                                </Link>
                            </Typo>{' '}
                            {t('zammadAgreementMessageEnd')}
                        </Typo>
                    }
                />
            </Box>

            {widgetState.feedbackStatus === 'FEEDBACK_FORM_SENDING' ? (
                <Box className={classes.progressWrap}>
                    <CircularProgress color="primary" />
                </Box>
            ) : (
                <Button
                    className={classes.formSubmitButton}
                    type="submit"
                    variant="contained"
                    color="primary"
                    disabled={isFormInvalid}
                >
                    {t('zammadMessageButtonSubmitLabel')}
                </Button>
            )}
        </form>
    );
};
