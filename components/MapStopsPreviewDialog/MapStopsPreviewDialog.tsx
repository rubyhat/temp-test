import React, { FC, useRef } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Dialog from '@material-ui/core/Dialog';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import useMediaQuery from '@material-ui/core/useMediaQuery';

import { MobileDialog } from '../ui/MobileDialog';
import { YandexMapEndpointPicker } from 'components/YandexEndpointPicker';
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
        },
    },
    { name: 'MapStopsPreviewDialog' }
);

type MapStopsPreviewDialogProps = {
    open: boolean;
    onClose: () => void;
    endpoints: StopsDto[];
    /** AppBar title **/
    title: string;
};

export const MapStopsPreviewDialog: FC<MapStopsPreviewDialogProps> = props => {
    const { open, onClose, endpoints, title } = props;
    const classes = useStyles();
    const containerRef = useRef(null);
    const isDesktop = useMediaQuery(theme.breakpoints.up('md')) && !isCordova;

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
                        containerEl={containerRef}
                        endpoints={endpoints}
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
                        containerEl={containerRef}
                        endpoints={endpoints}
                    />
                </div>
            </MobileDialog>
        );
    }
};
