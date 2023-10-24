import React, { CSSProperties, FC, RefObject, useRef, useState } from 'react';
import MapGL, { Marker, ViewportProps, GeolocateControl } from 'react-map-gl';

import useElementSize from '../useElementSize';
import { BusPoint } from './BusPoint';
import { MapPoint } from '../MapPoint';
import { PositionDto, StopsDto } from 'swagger/client';

export type BusLocationMapProps = {
    value?: StopsDto['id'] | null;
    onChange?: (value: StopsDto['id'] | null) => void;
    busPosition: PositionDto;
    pickupStop: StopsDto;
    dischargeStop: StopsDto;
    defaultLatitude: number;
    defaultLongitude: number;
    defaultZoom?: number;
    containerEl: RefObject<HTMLElement | Window | null>;
    enableGeolocateControl?: boolean;
    delay?: number;
};

const geolocateControlStyle: CSSProperties = {
    display: 'inline-block',
    position: 'absolute',
    bottom: 0,
    right: 0,
    marginRight: 8,
    marginBottom: 40,
};

export const BusLocationMap: FC<BusLocationMapProps> = props => {
    const {
        value: valueProp,
        onChange = () => {},
        busPosition,
        pickupStop,
        dischargeStop,
        defaultLongitude,
        defaultLatitude,
        defaultZoom = 12,
        containerEl,
        enableGeolocateControl,
        delay = 5000,
    } = props;

    const { current: isControlled } = useRef(valueProp != null);
    const [valueState, setValue] = useState<StopsDto['id'] | null>(null);
    const value = isControlled ? valueProp : valueState;

    const [viewport, setViewport] = useState<Partial<ViewportProps>>({
        latitude: defaultLatitude,
        longitude: defaultLongitude,
        zoom: defaultZoom,
    });
    const windowSize = useElementSize(containerEl.current, [
        containerEl.current,
    ]);

    const handleViewportChange = (viewportProps: ViewportProps) => {
        setViewport(viewportProps);
    };
    const handleMapPointChange = (id: StopsDto['id']) => (
        pointValue: boolean
    ) => {
        if (pointValue) {
            onChange(id);

            if (!isControlled) {
                setValue(id);
            }
        } else {
            onChange(null);

            if (!isControlled) {
                setValue(null);
            }
        }
    };

    return (
        <MapGL
            {...viewport}
            width={windowSize.width}
            height={windowSize.height}
            mapboxApiAccessToken={process.env.MAPBOX_TOKEN}
            onViewportChange={handleViewportChange}
            mapStyle={process.env.MAPBOX_STYLE}
        >
            <Marker
                latitude={pickupStop.latitude}
                longitude={pickupStop.longitude}
                key={pickupStop.id}
            >
                <MapPoint
                    open={value === pickupStop.id}
                    onChange={handleMapPointChange(pickupStop.id)}
                    tooltip={pickupStop.desc}
                />
            </Marker>

            <Marker
                latitude={dischargeStop.latitude}
                longitude={dischargeStop.longitude}
                key={dischargeStop.id}
            >
                <MapPoint
                    open={value === dischargeStop.id}
                    onChange={handleMapPointChange(dischargeStop.id)}
                    tooltip={dischargeStop.desc}
                />
            </Marker>

            <BusPoint position={busPosition} delay={delay} />

            {enableGeolocateControl ? (
                <GeolocateControl
                    positionOptions={{ enableHighAccuracy: true }}
                    trackUserLocation={true}
                    style={geolocateControlStyle}
                />
            ) : null}
        </MapGL>
    );
};
