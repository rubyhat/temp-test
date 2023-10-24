import React, { FC, useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { makeStyles } from '@material-ui/core/styles';
import Dialog from '@material-ui/core/Dialog';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';

import { Button } from '../ui/Button';
import { MobileDialog } from '../ui/MobileDialog';
import { BusLocationMap, BusLocationMapProps } from '../BusLocationMap';
import { StopsDto } from 'swagger/client';
import { useTranslation } from 'i18n';
import { RootState } from 'store';
import { BUS_LOCATION_ERROR, BusLocationState } from 'store/bus-location/types';
import { busLocationFetching } from 'store/bus-location/actions';
import useInterval from '../useInterval';
import { AppBar } from '../AppBar';
import { usePlatform } from 'hooks/usePlatform';

const useStyles = makeStyles(
    () => ({
        /* Styles applied to the root element. */
        root: {},
        /* Styles applied to the container `div` element. */
        container: {
            width: '100%',
            height: '100%',
        },
        /* Styles applied to the container `div` element (desktop). */
        desktopContainer: {
            width: '100%',
            height: '100vh',
        },
    }),
    { name: 'BusLocationDialog' }
);

type Props = {
    orderId: string;
    pickupStop: StopsDto;
    dischargeStop: StopsDto;
    BusLocationMapProps?: Partial<BusLocationMapProps>;
};

export const BusLocationDialog: FC<Props> = props => {
    const {
        pickupStop,
        dischargeStop,
        orderId,
        BusLocationMapProps = null,
    } = props;
    const classes = useStyles();
    const { t } = useTranslation();
    const dispatch = useDispatch();
    const { isDesktop } = usePlatform();

    const containerRef = useRef(null);
    const [open, setOpen] = useState(false);
    const handleClose = () => {
        document.body.style.overflow = 'auto';
        setOpen(false);
    };
    const handleOpen = () => {
        document.body.style.overflow = 'hidden';
        setOpen(true);
    };

    const { position, status } = useSelector<RootState, BusLocationState>(
        rootState => rootState.busLocation
    );
    const [delay, setDelay] = useState<number | null>(3000);
    useEffect(() => {
        if (status === BUS_LOCATION_ERROR) {
            setDelay(null);
        }
    }, [status]);

    useInterval(() => {
        dispatch(busLocationFetching(orderId));
    }, delay);

    if (isDesktop) {
        return (
            <div className={classes.root}>
                <Button
                    onClick={handleOpen}
                    color="primary"
                    variant="outlined"
                    fullWidth
                >
                    {t('order:yourCarOnTheMap')}
                </Button>

                <Dialog
                    disableScrollLock
                    open={open}
                    onClose={handleClose}
                    fullWidth
                    maxWidth="md"
                >
                    <AppBar
                        title={t('order:yourCarOnTheMap')}
                        disableBackIcon
                        endIcon={
                            <IconButton
                                color="primary"
                                edge="end"
                                onClick={handleClose}
                            >
                                <CloseIcon />
                            </IconButton>
                        }
                    />

                    <div
                        className={classes.desktopContainer}
                        ref={containerRef}
                    >
                        {position ? (
                            <BusLocationMap
                                defaultLatitude={position.latitude}
                                defaultLongitude={position.longitude}
                                pickupStop={pickupStop}
                                dischargeStop={dischargeStop}
                                busPosition={position}
                                containerEl={containerRef}
                                {...BusLocationMapProps}
                            />
                        ) : null}
                    </div>
                </Dialog>
            </div>
        );
    }

    return (
        <div className={classes.root}>
            <Button
                onClick={handleOpen}
                color="primary"
                variant="outlined"
                fullWidth
            >
                {t('order:yourCarOnTheMap')}
            </Button>

            <MobileDialog
                title={t('order:yourCarOnTheMap')}
                open={open}
                onClose={handleClose}
                startIcon="close"
            >
                <div className={classes.container} ref={containerRef}>
                    {position ? (
                        <BusLocationMap
                            defaultLatitude={position.latitude}
                            defaultLongitude={position.longitude}
                            pickupStop={pickupStop}
                            dischargeStop={dischargeStop}
                            busPosition={position}
                            containerEl={containerRef}
                            {...BusLocationMapProps}
                        />
                    ) : null}
                </div>
            </MobileDialog>
        </div>
    );
};
