import React, { FC } from 'react';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import { makeStyles, Theme } from '@material-ui/core/styles';

import { Button } from 'components/ui/Button';
import { ResponsiveDialog } from 'components/ui/ResponsiveDialog';
import { Typo } from 'components/Typo/Typo';
import { useTranslation } from 'i18n';
import SurgeIcon from 'components/icons/Surge';
import { SURGE_DEFAULT_COLOR } from 'components/Surge/constants';
import { useSAAS } from 'hooks/useSAAS';

const useStyles = makeStyles(
    (theme: Theme) => ({
        /* Styles applied to the root element. */
        root: {
            '& .MuiDialog-paper': {
                maxWidth: 360,
            },
        },
        iconContainer: {
            textAlign: 'center',
            marginBottom: theme.spacing(4),
        },
        surgeIcon: {
            color: SURGE_DEFAULT_COLOR,
        },
        title: {
            textAlign: 'center',
        },
        description: {
            marginTop: theme.spacing(2),
        },
    }),
    { name: 'SurgeDialog' }
);

type Props = {
    open: boolean;
    onClose: () => void;
};

export const SurgeDialog: FC<Props> = props => {
    const { open, onClose } = props;
    const classes = useStyles();
    const { t } = useTranslation();
    const { meta } = useSAAS();

    return (
        <ResponsiveDialog
            className={classes.root}
            open={open}
            onClose={onClose}
            position="center"
            fullScreen={false}
            fullWidth
        >
            <DialogContent>
                <DialogContentText>
                    <div className={classes.iconContainer}>
                        <SurgeIcon
                            className={classes.surgeIcon}
                            fontSize="large"
                            color="inherit"
                            style={{
                                color: meta.surgeColor,
                            }}
                        />
                    </div>

                    <Typo
                        variant="title"
                        color="textPrimary"
                        className={classes.title}
                    >
                        {t('search:surgeDialogTitle')}
                    </Typo>
                    <Typo variant="body1" className={classes.description}>
                        {t('search:surgeDialogDescription')}
                    </Typo>
                </DialogContentText>
            </DialogContent>

            <DialogActions>
                <Button onClick={onClose} color="primary">
                    {t('ok')}
                </Button>
            </DialogActions>
        </ResponsiveDialog>
    );
};
