import React, { FC, useRef } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Dialog from '@material-ui/core/Dialog';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import useMediaQuery from '@material-ui/core/useMediaQuery';

import { MobileDialog, Props as MobileDialogProps } from '../ui/MobileDialog';
import { Props as MapEndpointPickerProps } from '../MapEndpointPicker';
import { YandexMapEndpointPicker } from 'components/YandexEndpointPicker';
import { ActionBar } from '../ActionBar';
import { Button } from '../ui/Button';
import { useTranslation } from 'i18n';
import theme from 'themes/default';
import { AppBar } from '../AppBar';
import { StopsDto } from 'swagger/client';
import { isCordova } from 'utils/platform';

const useStyles = makeStyles(
    {
        container: {
            width: '100%',
            height: '100%',
        },
        desktopContainer: {
            width: '100%',
            height: '100vh',
            overflowY: 'hidden',
        },
    },
    { name: 'MapEndpointPickerDialog' }
);

type Props = Pick<MobileDialogProps, 'open' | 'onClose' | 'title'> &
    Omit<MapEndpointPickerProps, 'containerEl'>;

export const MapEndpointPickerDialog: FC<Props> = props => {
    const {
        value,
        open,
        onClose,
        onChange,
        title,
        onAccept = () => {},
        ...rest
    } = props;
    const classes = useStyles();
    const containerRef = useRef(null);
    const { t } = useTranslation();
    const isDesktop = useMediaQuery(theme.breakpoints.up('md')) && !isCordova;

    const handleClick = () => {
        value && onAccept(value);
    };

    const handleChange = (id: StopsDto['id'] | null) => {
        if (onChange) onChange(id);
        if (id) onAccept(id);
    };

    if (isDesktop) {
        return (
            <Dialog
                disableScrollLock
                open={open}
                onClose={onClose}
                fullWidth
                maxWidth="md"
            >
                <AppBar
                    title={title}
                    disableBackIcon
                    endIcon={
                        <IconButton
                            color="primary"
                            edge="end"
                            onClick={onClose}
                        >
                            <CloseIcon />
                        </IconButton>
                    }
                />

                <div className={classes.desktopContainer} ref={containerRef}>
                    <YandexMapEndpointPicker
                        value={value}
                        containerEl={containerRef}
                        onChange={handleChange}
                        {...rest}
                    />
                </div>
            </Dialog>
        );
    } else {
        return (
            <MobileDialog
                title={title}
                open={open}
                onClose={onClose}
                startIcon="close"
            >
                <div className={classes.container} ref={containerRef}>
                    <YandexMapEndpointPicker
                        value={value}
                        containerEl={containerRef}
                        onChange={onChange}
                        {...rest}
                    />
                </div>

                {value && (
                    <ActionBar position="fixed">
                        <Button
                            variant="contained"
                            color="primary"
                            fullWidth
                            onClick={handleClick}
                        >
                            {t('select')}
                        </Button>
                    </ActionBar>
                )}
            </MobileDialog>
        );
    }
};
