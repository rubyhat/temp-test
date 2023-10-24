import React, { FC } from 'react';
import { makeStyles, Theme } from '@material-ui/core/styles';

import { ResponsiveDialog } from '../ui/ResponsiveDialog';
import { LoginForm } from '../LoginForm';
import { Typo } from '../Typo/Typo';
import { Button } from '../ui/Button';
import { useTranslation } from 'i18n';
import { formatPhone } from 'utils/phone';
import { usePlatform } from 'hooks/usePlatform';

const useStyles = makeStyles(
    (theme: Theme) => ({
        /* Styles applied to the root element. */
        root: {},
        authDialog: {
            padding: theme.spacing(4),
        },
        loginDialogTitle: {
            marginTop: theme.spacing(1),
        },
        loginDialogSubtitle: {
            marginTop: theme.spacing(1),
        },
    }),
    { name: 'LoginSuggestDialog' }
);

type Props = {
    open: boolean;
    onClose: () => void;
    phone: string;
};

export const LoginSuggestDialog: FC<Props> = props => {
    const { open, onClose, phone } = props;
    const classes = useStyles();
    const { t } = useTranslation();
    const { isDesktop, isMobile, isCordova } = usePlatform();

    return (
        <ResponsiveDialog
            open={open}
            className={classes.root}
            onClose={onClose}
            position="center"
            fullScreen={false}
            maxWidth={isMobile || isCordova ? 'sm' : 'md'}
            fullWidth={isMobile || isCordova}
        >
            <LoginForm
                showPromo={isDesktop}
                className={classes.authDialog}
                header={
                    <>
                        <Typo
                            variant="subtitle"
                            weight="bold"
                            align="center"
                            className={classes.loginDialogTitle}
                        >
                            {t('booking:youCanLoginWithThisNumber')}
                        </Typo>

                        <Typo
                            align="center"
                            component="div"
                            className={classes.loginDialogSubtitle}
                        >
                            {t('booking:youCanLoginWithThisNumberText', {
                                phone: formatPhone(phone),
                            })}
                        </Typo>
                    </>
                }
                actions={
                    <Button
                        onClick={onClose}
                        variant="outlined"
                        color="primary"
                        fullWidth
                        style={{ marginBottom: 8 }}
                    >
                        {t('booking:back')}
                    </Button>
                }
                onLogin={onClose}
                loginButtonText={t('login')}
                disableRememberMe
                disableForgotPassword
                autocompleteCountryCode={true}
                disablePhoneInput
            />
        </ResponsiveDialog>
    );
};
