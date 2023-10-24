import React from 'react';
import { Dialog, Paper, Typography } from '@material-ui/core';

import { Button } from 'components/ui/Button';
import { IPolicyModal } from 'components/Policy/PolicyModal/interfaces';

import useStyles from './styles';
import apiClient from 'lib/apiClient';
import { useDispatch } from 'react-redux';
import { userFetching } from 'store/user/actions';
import { useTranslation } from 'react-i18next';

export const PolicyModal = (props: IPolicyModal) => {
    const { setIsOpen, open, data } = props;
    const { title, subtitle, docUrl, version } = data;
    const [isPending, setIsPending] = React.useState(false);
    const classes = useStyles();
    const dispatch = useDispatch();
    const { t } = useTranslation();

    const handleClose = () => {
        setIsOpen(false);
    };

    const handleSubmit = () => {
        setIsPending(true);
        apiClient.setUserPolicyVersion(version).then(res => {
            setIsPending(false);
            setIsOpen(false);
            dispatch(userFetching());
        });
    };

    return (
        <Dialog
            onClose={handleClose}
            aria-labelledby="policy-modal-title"
            open={open}
            maxWidth="md"
            disableEscapeKeyDown
            disableBackdropClick
        >
            <Paper elevation={0} className={classes.policyContent}>
                <Typography
                    component="h2"
                    className={classes.policyTitle}
                    id="policy-modal-title"
                >
                    {title}
                </Typography>
                <Typography component="h3" className={classes.policySubTitle}>
                    {subtitle}
                </Typography>
                <Paper elevation={0} className={classes.policyBody}>
                    <Paper elevation={0} className={classes.policyWrapperText}>
                        <iframe
                            id="docs"
                            className={classes.iframe}
                            title="ps"
                            src={docUrl}
                        />
                    </Paper>
                </Paper>

                <Typography className={classes.policyAcceptText} component="p">
                    {t('policyAcceptInfoText')}
                </Typography>
                <Button
                    onClick={handleSubmit}
                    className={classes.policyButton}
                    variant="contained"
                    color="primary"
                    disabled={isPending}
                >
                    {isPending ? t('loading') : t('accept')}
                </Button>
            </Paper>
        </Dialog>
    );
};
