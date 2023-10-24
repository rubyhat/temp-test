import React, { FC } from 'react';
import Button from '@material-ui/core/Button';
import CloseIcon from '@material-ui/icons/Close';
import IconButton from '@material-ui/core/IconButton';
import { makeStyles, Theme } from '@material-ui/core/styles';

import { BaseBar, Props as BaseBarProps } from '../ui/BaseBar';
import { useTranslation } from 'i18n';
import { AtlasTheme } from 'typings/atlas-theme';

const useStyles = makeStyles((theme: Theme & AtlasTheme) => ({
    /* Styles applied to the reset `Button` component. */
    reset: {
        fontSize: theme.atlas.typography.body1.fontSize,
        textTransform: 'unset',
        padding: '0 4px',
        '&:hover': {
            backgroundColor: 'unset',
        },
    },
    /* Styles applied to the filters text `div` element. */
    text: {
        flexGrow: 1,
        textAlign: 'center',
        position: 'absolute',
        left: 0,
        right: 0,
        marginLeft: 104,
        marginRight: 104,
    },
    /* Styles applied to the `IconButton` component. */
    closeButton: {
        marginLeft: 'auto',
    },
}));

type Props = BaseBarProps & {
    onReset?: () => void;
    onClose?: () => void;
    showReset?: boolean;
};

export const FiltersBar: FC<Props> = props => {
    const {
        onReset = () => {},
        onClose = () => {},
        showReset = false,
        ...rest
    } = props;
    const classes = useStyles();
    const { t } = useTranslation();

    return (
        <BaseBar {...rest} paddingTop={false}>
            {showReset && (
                <Button
                    className={classes.reset}
                    color="primary"
                    onClick={onReset}
                >
                    {t('search:filtersReset')}
                </Button>
            )}
            <div className={classes.text}>{t('search:filters')}</div>
            <IconButton
                edge="end"
                color="primary"
                onClick={onClose}
                className={classes.closeButton}
            >
                <CloseIcon />
            </IconButton>
        </BaseBar>
    );
};
