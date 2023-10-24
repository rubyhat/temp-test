import React, { FC, useState } from 'react';
import InfoOutlinedIcon from '@material-ui/icons/InfoOutlined';
import clsx from 'clsx';
import { makeStyles, Theme } from '@material-ui/core/styles';

import { SurgeDialog } from 'components/Surge/SurgeDialog';
import { Typo } from 'components/Typo/Typo';
import SurgeIcon from 'components/icons/Surge';
import { useTranslation } from 'i18n';
import { SURGE_DEFAULT_COLOR } from 'components/Surge/constants';
import { useSAAS } from 'hooks/useSAAS';
import { AtlasTheme } from 'typings/atlas-theme';

const useStyles = makeStyles(
    (theme: Theme & AtlasTheme) => ({
        /* Styles applied to the root element. */
        root: {
            backgroundColor: '#FFF',
            boxShadow: theme.atlas.shadows.bottom,
            borderRadius: theme.shape.borderRadius,
            padding: theme.spacing(2),
        },
        container: {
            display: 'flex',
            alignItems: 'center',
        },
        surgeIcon: {
            marginRight: theme.spacing(2),
            color: SURGE_DEFAULT_COLOR,
        },
        infoIcon: {
            color: theme.palette.text.secondary,
            cursor: 'pointer',
        },
        spacer: {
            flexGrow: 1,
            alignSelf: 'start',
        },
    }),
    { name: 'SurgeCard' }
);

type Props = {
    className?: string;
};

export const SurgeCard: FC<Props> = props => {
    const { className } = props;
    const classes = useStyles();
    const { t } = useTranslation();
    const { meta } = useSAAS();

    const [open, setOpen] = useState(false);
    const handleClose = () => {
        document.body.style.overflow = 'auto';
        setOpen(false);
    };

    return (
        <div className={clsx(classes.root, className)}>
            <div className={classes.container}>
                <SurgeIcon
                    className={classes.surgeIcon}
                    fontSize="large"
                    color="inherit"
                    style={{
                        color: meta.surgeColor,
                    }}
                />
                <Typo variant="body1">{t('search:surgeCardText')}</Typo>

                <div className={classes.spacer} />

                <InfoOutlinedIcon
                    className={classes.infoIcon}
                    onClick={() => {
                        setOpen(true);
                    }}
                    color="inherit"
                />
            </div>

            <SurgeDialog open={open} onClose={handleClose} />
        </div>
    );
};
