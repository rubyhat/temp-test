import React, { FC } from 'react';
import clsx from 'clsx';
import { makeStyles, Theme } from '@material-ui/core/styles';

import DriverSVG from './assets/driver.svg';
import ExitSVG from './assets/exit.svg';
import WcSVG from './assets/wc.svg';
import { AtlasTheme } from 'typings/atlas-theme';

const useStyles = makeStyles(
    (theme: Theme & AtlasTheme) => ({
        /* Styles applied to the root element. */
        root: {
            width: 272,
            backgroundColor: '#FFF',
        },
        row: {
            display: 'flex',
            justifyContent: 'space-between',
            '& ~ &': {
                marginTop: 8,
            },
        },
        seat: {
            width: 48,
            height: 48,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-around',
            border: `1px solid ${theme.palette.primary.main}`,
            color: theme.palette.primary.main,
            borderRadius: theme.shape.borderRadius,
            fontSize: theme.atlas.typography.body1.fontSize,
            boxSizing: 'border-box',
            cursor: 'default',
            userSelect: 'none',
        },
        seatActive: {
            backgroundColor: theme.palette.primary.main,
            color: '#FFF',
        },
        seatDisabled: {
            backgroundColor: theme.atlas.palette.background.disabled,
            color: theme.atlas.palette.text.disabled,
            border: 'none',
        },
        seatDisableBorder: {
            border: 'none',
        },
    }),
    { name: 'SeatsScheme' }
);

export type SeatType = 'driver' | 'seat' | 'passage' | 'wc' | 'exit' | 'empty';
export type SeatStatus = 'free' | 'occupied';

export type SeatsScheme = string[];

export type SeatsMap = {
    number: number; // номер места
    x: number; // координата по оси x
    y: number; // координата по оси y
    type: SeatType; // тип места
    status: SeatStatus; // статус места
};

type Props = {
    seatsScheme: SeatsScheme;
    seatsMap: SeatsMap[];
};

export const SeatsScheme: FC<Props> = props => {
    const { seatsMap, seatsScheme } = props;
    const classes = useStyles();

    const checkIsDisabled = (seat?: SeatsMap): boolean => {
        return (
            (seat && seat.type === 'seat' && seat.status === 'occupied') ||
            false
        );
    };

    const checkDisableBorder = (seat?: SeatsMap): boolean => {
        return (seat && seat.type !== 'seat') || false;
    };

    const renderSeat = (symbol: string, seat: SeatsMap) => {
        if (symbol === 'd') {
            return <DriverSVG />;
        } else if (symbol === 'e') {
            return <ExitSVG />;
        } else if (symbol === 'w') {
            return <WcSVG />;
        } else if (symbol === 's') {
            return <span>{seat.number}</span>;
        } else {
            return null;
        }
    };

    const renderScheme = () => {
        return seatsScheme.map((line, lineIndex) => {
            return (
                <div className={classes.row} key={lineIndex}>
                    {line.split('').map((symbol, symbolIndex) => {
                        const seatNumber =
                            lineIndex * line.length + symbolIndex + 1;
                        const seat = seatsMap[seatNumber - 1];

                        return (
                            <div
                                className={clsx(classes.seat, {
                                    [classes[`seatActive`]]: false,
                                    [classes[`seatDisabled`]]: checkIsDisabled(
                                        seat
                                    ),
                                    [classes[
                                        `seatDisableBorder`
                                    ]]: checkDisableBorder(seat),
                                })}
                                key={symbolIndex}
                            >
                                {renderSeat(symbol, seat)}
                            </div>
                        );
                    })}
                </div>
            );
        });
    };

    return <div className={classes.root}>{renderScheme()}</div>;
};
