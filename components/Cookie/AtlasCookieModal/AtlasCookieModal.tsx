import React from 'react';
import { Button, Paper, Typography } from '@material-ui/core';
import useStyles from './styles';
import { useRouter } from 'next/router';
import { useTranslation } from 'i18n';

type CookieModalProps = {
    isOpen: boolean;
    acceptCookie: () => void;
};

export const AtlasCookieModal = ({
    isOpen,
    acceptCookie,
}: CookieModalProps) => {
    const classes = useStyles({ isOpen });
    const { t } = useTranslation();
    const router = useRouter();
    const onLinkClick = () => {
        router.push('/privacy');
    };

    return (
        <div className={classes.root}>
            <Paper elevation={1} className={classes.cookieContainer}>
                <Paper elevation={0} className={classes.cookieContent}>
                    <Typography
                        component="div"
                        className={classes.textContainer}
                    >
                        <Typography
                            className={classes.cookieText}
                            component="div"
                        >
                            {t('cookieModalText')}
                        </Typography>
                        <Typography
                            className={classes.linkText}
                            component="div"
                            onClick={onLinkClick}
                        >
                            {t('cookieModalLink')}
                        </Typography>
                    </Typography>
                    <Button
                        classes={{
                            root: classes.cookieAcceptButton,
                            label: classes.buttonLabel,
                        }}
                        variant="contained"
                        color="primary"
                        onClick={acceptCookie}
                    >
                        {t('cookieModalButton')}
                    </Button>
                </Paper>
            </Paper>
        </div>
    );
};
