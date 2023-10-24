import { SeatButton } from 'components/SeatButton';
import React from 'react';
import { useSelector } from 'react-redux';
import { RootState } from 'store';
import { BookingState } from 'store/booking/types';
import { SeatingCellDto, SeatingSchemeDto } from 'swagger/client';
import { useStyles } from 'components/MobileSeatStep/styles';

interface SchemaGroup {
    cells: SeatingCellDto[];
    key: number;
    seatingScheme: SeatingSchemeDto;
}

export const SchemaGroup = (props: SchemaGroup) => {
    const { key, cells, seatingScheme } = props;
    const { selectedSeats } = useSelector<RootState, BookingState>(
        rootState => rootState.booking
    );
    const groups = seatingScheme.groups || [];
    // const { along, across } = groups;

    // const classes = useStyles({
    //     along,
    //     across,
    //     isDesktop,
    //     tabCount: seatingScheme.length,
    // });
    return (
        <></>
        // <div key={key} className={classes.seatWrap}>
        //     @todo: вынести в отдельный компонент
        //     {cells.map((cell, index) => (
        //         <SeatButton
        //             cell={cell}
        //             selectedSeats={selectedSeats}
        //             key={index}
        //             numberOfPassengers={numberOfPassengers}
        //         />
        //     ))}
        // </div>
    );
};
