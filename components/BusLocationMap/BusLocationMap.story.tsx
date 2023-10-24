import React, { useRef, useState } from 'react';
import { storiesOf } from '@storybook/react';
import { makeStyles } from '@material-ui/core/styles';

import { BusLocationMap } from './BusLocationMap';
import { StopsDto } from 'swagger/client';
import useInterval from '../useInterval';
import busLocation from './bus-location.mock.json';

const useStyles = makeStyles(
    {
        /* Styles applied to the root element. */
        root: {
            width: '100%',
            height: '500px',
        },
    },
    { name: 'BusLocationMap-story' }
);

storiesOf('BusLocationMap', module).add('default', () => {
    const Component = () => {
        const classes = useStyles();
        const containerRef = useRef(null);

        const interval = 3000;
        const [delay, setDelay] = useState<number | null>(interval);
        const [busPositionIndex, setBusPositionIndex] = useState(0);

        useInterval(() => {
            if (busPositionIndex >= busLocation.length - 1) {
                setDelay(null);
                console.log('the bus arrived');
                return;
            }
            setBusPositionIndex(busPositionIndex + 1);
        }, delay);

        return (
            <div className={classes.root} ref={containerRef}>
                <BusLocationMap
                    busPosition={busLocation[busPositionIndex]}
                    pickupStop={pickupStop}
                    dischargeStop={dischargeStop}
                    defaultLatitude={53.671777}
                    defaultLongitude={23.8033}
                    containerEl={containerRef}
                    enableGeolocateControl
                    delay={interval}
                />
            </div>
        );
    };

    return <Component />;
});

const pickupStop: StopsDto = {
    latitude: 53.671777,
    desc: 'Стадион "Калининград"',
    timezone: 'Europe/Kaliningrad',
    datetime: '2020-03-21T19:00:00',
    id: '10885',
    longitude: 23.8033,
    important: false,
    dynamic: false,
};

const dischargeStop: StopsDto = {
    latitude: 53.673933,
    desc: 'Курский вокзал',
    timezone: 'Europe/Moscow',
    datetime: '2020-03-22T00:00:00',
    id: '10887',
    longitude: 23.872475,
    important: false,
    dynamic: false,
};
