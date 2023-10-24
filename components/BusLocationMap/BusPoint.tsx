import React, { FC, useEffect, useRef, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Marker } from 'react-map-gl';

import useInterval from '../useInterval';
import { PositionDto } from 'swagger/client';
import { publicPath } from 'utils/publicPath';

const useStyles = makeStyles(
    () => ({
        /* Styles applied to the root element. */
        root: {},
        /* Styles applied to the bus `Marker` component. */
        busMarker: {
            width: 23,
            height: 23,
            position: 'relative',
        },
        /* Styles applied to the bus icon `img` element. */
        busIcon: {
            position: 'absolute',
            left: 0,
            top: '-23px',
        },
    }),
    { name: 'BusPoint' }
);

type Props = {
    position: PositionDto;
    delay: number;
};

export const BusPoint: FC<Props> = props => {
    const { position, delay } = props;
    const classes = useStyles();

    const interval = 50;
    const steps = delay / interval;
    const step = useRef(1);

    const [currBusPosition, setCurrBusPosition] = useState<PositionDto>(
        position
    );
    const xStepSize = useRef(0);
    const yStepSize = useRef(0);
    const startLat = useRef(position.latitude);
    const startLng = useRef(position.longitude);

    useEffect(() => {
        xStepSize.current =
            (position.longitude - currBusPosition.longitude) / steps;
        yStepSize.current =
            (position.latitude - currBusPosition.latitude) / steps;
        step.current = 0;

        startLat.current = currBusPosition.latitude;
        startLng.current = currBusPosition.longitude;
    }, [position]);

    useInterval(() => {
        if (step.current >= steps) return;
        step.current++;

        setCurrBusPosition({
            ...currBusPosition,
            longitude: startLng.current + xStepSize.current * step.current,
            latitude: startLat.current + yStepSize.current * step.current,
        });
    }, interval);

    return (
        <div className={classes.root}>
            <Marker
                className={classes.busMarker}
                latitude={currBusPosition.latitude}
                longitude={currBusPosition.longitude}
                offsetLeft={0}
                offsetTop={0}
                key={position.timestamp}
            >
                <img
                    className={classes.busIcon}
                    alt="bus"
                    src={publicPath('/static/cars/M2_FFFFFF.png')}
                    width="24"
                    style={{
                        transform: `rotate(${position.direction}deg)`,
                    }}
                />
            </Marker>
        </div>
    );
};
