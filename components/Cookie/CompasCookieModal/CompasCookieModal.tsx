import React, { ChangeEvent } from 'react';
import {
    Button,
    Paper,
    Typography,
    RadioGroup,
    FormControlLabel,
    Radio,
} from '@material-ui/core';
import useStyles from './styles';
import { useTranslation } from 'i18n';
import CloseIcon from '@material-ui/icons/Close';
import { useRouter } from 'next/router';

type CookieModalProps = {
    isOpen: boolean;
    acceptCookie: (withAd?: boolean) => void;
};

export const CompasCookieModal = ({
    isOpen,
    acceptCookie,
}: CookieModalProps) => {
    const { t } = useTranslation();
    const router = useRouter();
    const isPrivacy = router.pathname === '/privacy';
    const [isOptions, setIsOptions] = React.useState(false);
    const [includeAd, setIncludeAd] = React.useState('include');
    const classes = useStyles({ isOpen, isPrivacy, isOptions });

    const onLinkClick = () => {
        setIsOptions(false);
        router.push('/privacy');
    };

    const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
        setIncludeAd(event.target.value);
    };

    const onSaveClick = () => {
        const withAd = includeAd === 'include';
        setIsOptions(false);
        acceptCookie(withAd);
    };

    return (
        <div className={classes.wrapper}>
            {isOptions ? (
                <div className={classes.optionsRoot}>
                    <div className={classes.optionsWrapper}>
                        <div className={classes.optionsHeader}>
                            <CloseIcon
                                className={classes.closeIcon}
                                color="primary"
                                onClick={() => setIsOptions(false)}
                            />
                        </div>
                        <Typography
                            className={classes.optionsText}
                            component="div"
                        >
                            {t('compasCookieOptionsDesc')}
                        </Typography>
                        <Typography
                            className={classes.optionsTitle}
                            component="div"
                        >
                            {t('compasCookieRequiredTitle')}
                        </Typography>
                        <Typography
                            className={classes.optionsTextContainer}
                            component="div"
                        >
                            <Typography>
                                {t('compasCookieRequiredDesc')}
                            </Typography>
                            <Typography
                                className={classes.linkText}
                                onClick={onLinkClick}
                            >
                                {t('compasCookieRequiredLink')}
                            </Typography>
                        </Typography>
                        <Typography className={classes.optionsTitle}>
                            {t('compasCookieAdTitle')}
                        </Typography>
                        <RadioGroup
                            className={classes.radioGroup}
                            value={includeAd}
                            onChange={handleChange}
                        >
                            <FormControlLabel
                                value="include"
                                control={<Radio />}
                                label={t('compasCookieAdInclude')}
                            />
                            <FormControlLabel
                                value="doNotInclude"
                                control={<Radio />}
                                label={t('compasCookieAdDoNotInclude')}
                            />
                        </RadioGroup>
                        <Typography
                            className={classes.optionsTextContainer}
                            component="div"
                        >
                            <Typography>{t('compasCookieAdDesc')}</Typography>
                            <Typography
                                className={classes.linkText}
                                onClick={onLinkClick}
                            >
                                {t('compasCookieAdLink')}
                            </Typography>
                        </Typography>
                        <Button
                            className={classes.saveButton}
                            classes={{
                                root: classes.cookieAcceptButton,
                                label: classes.buttonLabel,
                            }}
                            variant="contained"
                            color="primary"
                            onClick={onSaveClick}
                        >
                            {t('compasCookieSave')}
                        </Button>
                    </div>
                </div>
            ) : (
                <div className={classes.root}>
                    <Paper elevation={1} className={classes.cookieContainer}>
                        <Paper elevation={0} className={classes.cookieContent}>
                            <div className={classes.textContainer}>
                                <Typography className={classes.cookieText}>
                                    {t('compasCookieModalText')}
                                </Typography>
                            </div>
                            <div className={classes.buttons}>
                                <Button
                                    classes={{
                                        root: classes.cookieAcceptButton,
                                        label: classes.buttonLabel,
                                    }}
                                    variant="contained"
                                    color="primary"
                                    onClick={() => acceptCookie(true)}
                                >
                                    {t('compasCookieModalConfirmButton')}
                                </Button>
                                <Button
                                    classes={{
                                        root: classes.cookieAcceptButton,
                                        label: classes.buttonLabel,
                                    }}
                                    variant="outlined"
                                    color="primary"
                                    onClick={() => setIsOptions(true)}
                                >
                                    {t('compasCookieModalOptionsButton')}
                                </Button>
                            </div>
                        </Paper>
                    </Paper>
                </div>
            )}
        </div>
    );
};
