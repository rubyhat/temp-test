import React from 'react';
import IconSeatSVG from './assets/icon-seat.svg';
import IconArrowSVG from './assets/icon-arrow-right.svg';
import IconDeleteSVG from './assets/icon-delete.svg';
import { useStyles } from 'components/SelectSeatField/styles';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from 'store';
import { BookingState } from 'store/booking/types';
import { Dialog, DialogContent, IconButton } from '@material-ui/core';
import { bookingUpdateState } from 'store/booking/actions';
import { rideUpdating } from 'store/ride/actions';
import { usePlatform } from 'hooks/usePlatform';
import { isCordova } from 'utils/platform';
import { MobileSeatStep } from 'components/MobileSeatStep';
import { RideState } from 'store/ride/types';
import CloseIcon from '@material-ui/icons/Close';
import { Typo } from 'components/Typo/Typo';
import { Button } from 'components/ui/Button';
import { SeatingSchemeDto } from 'swagger/client';
import { useTranslation } from 'i18n';
import { SelectSeatsNoSeatsCard } from 'components/SelectSeatsNoSeatsCard';

export const SelectSeatField = () => {
    const { t } = useTranslation();
    const classes = useStyles();
    const dispatch = useDispatch();
    const { rideInfo: ride } = useSelector<RootState, RideState>(
        rootState => rootState.ride
    );
    const { selectedSeats, isOpenSelectSeatModal, passengers } = useSelector<
        RootState,
        BookingState
    >(rootState => rootState.booking);

    const hasSelectedSeats = selectedSeats.length > 0;
    const numberOfPassengers = Object.keys(passengers || {}).length;
    const isEnoughSeats = ride && ride.freeSeats >= numberOfPassengers;

    const handleFieldClick = () =>
        dispatch(bookingUpdateState({ isOpenSelectSeatModal: true }));
    const handleDeleteIconClick = () =>
        dispatch(bookingUpdateState({ selectedSeats: [] }));

    const { isMobile } = usePlatform();

    const handleCloseModal = () => {
        dispatch(rideUpdating());
        dispatch(bookingUpdateState({ isOpenSelectSeatModal: false }));
        document.body.style.overflow = 'auto';
    };

    if (ride) {
        return (
            <>
                <div className={classes.root} onClick={handleFieldClick}>
                    <div className={classes.textWrap}>
                        <IconSeatSVG
                            className={
                                hasSelectedSeats
                                    ? classes.activeIcon
                                    : classes.icon
                            }
                        />
                        <span className={classes.text}>
                            {t('selectSeatMainTitle')}
                        </span>
                    </div>
                    {hasSelectedSeats ? (
                        <IconButton onClick={handleDeleteIconClick}>
                            <IconDeleteSVG />
                        </IconButton>
                    ) : (
                        <IconButton>
                            <IconArrowSVG />
                        </IconButton>
                    )}
                </div>
                <Dialog
                    disableScrollLock
                    open={isOpenSelectSeatModal}
                    onClose={handleCloseModal}
                    PaperProps={{ className: classes.modalDialog }}
                    fullScreen={isMobile || isCordova}
                    maxWidth="lg"
                >
                    <DialogContent className={classes.modalContent}>
                        <div className={classes.modalHeader}>
                            <Typo className={classes.modalTitle}>
                                {t('selectSeatChooseSeat')}
                            </Typo>
                            <IconButton onClick={handleCloseModal}>
                                <CloseIcon color="primary" />
                            </IconButton>
                        </div>
                        {!isEnoughSeats && (
                            <div className={classes.noSeatsWrap}>
                                <SelectSeatsNoSeatsCard />
                            </div>
                        )}
                        <div className={classes.modalBody}>
                            <MobileSeatStep
                                seatingScheme={
                                    ride.seatingScheme as SeatingSchemeDto[]
                                }
                                numberOfPassengers={numberOfPassengers}
                                inModal={true}
                            />
                        </div>
                        <div className={classes.modalFooter}>
                            <Typo
                                variant="caption"
                                className={classes.modalSeatCountCap}
                            >
                                {t('selectSeatMainCountOfSeatSelected', {
                                    seats: selectedSeats.length,
                                    passengers: numberOfPassengers,
                                })}
                            </Typo>
                            <Button
                                variant="contained"
                                color="primary"
                                onClick={handleCloseModal}
                                disabled={
                                    selectedSeats.length !== numberOfPassengers
                                }
                                className={classes.modalButtonSubmit}
                            >
                                {t('select')}
                            </Button>
                        </div>
                    </DialogContent>
                </Dialog>
            </>
        );
    } else {
        return <></>;
    }
};
