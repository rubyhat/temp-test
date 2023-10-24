import React, { FC, RefObject, useRef, useState } from 'react';
import MapGL, {
    Marker,
    ViewportProps,
    WebMercatorViewport,
} from 'react-map-gl';
import { makeStyles } from '@material-ui/core/styles';

import useElementSize from 'components/useElementSize';
import { MapPoint } from '../MapPoint';
import { StopsDto } from 'swagger/client';
import { getBoundingBox } from 'utils/map';

const useStyles = makeStyles(
    {
        /* Styles applied to the Marker component. */
        marker: {
            // fix: tooltip zIndex is not work when `will-change="transform"`
            willChange: 'unset',
        },
    },
    { name: 'MapEndpointPicker' }
);

export type Props = {
    value?: StopsDto['id'] | null;
    endpoints?: StopsDto[];
    defaultLatitude?: number;
    defaultLongitude?: number;
    defaultZoom?: number;
    onChange?: (value: StopsDto['id'] | null) => void;
    onAccept?: (value: StopsDto['id']) => void;
    containerEl: RefObject<HTMLElement | Window | null>;
};

export const MapEndpointPicker: FC<Props> = props => {
    const {
        value: valueProp,
        endpoints = [],
        defaultLatitude,
        defaultLongitude,
        defaultZoom = 9,
        onChange = () => {},
        onAccept = () => {},
        containerEl,
    } = props;

    const { current: isControlled } = useRef(valueProp != null);
    const [valueState, setValue] = useState<StopsDto['id'] | null>(null);
    const value = isControlled ? valueProp : valueState;

    const windowSize = useElementSize(containerEl.current, [
        containerEl.current,
    ]);
    const [viewport, setViewport] = useState<Partial<ViewportProps>>({
        latitude: defaultLatitude,
        longitude: defaultLongitude,
        zoom: defaultZoom,
    });
    const classes = useStyles();

    const handleViewportChange = (viewportProps: ViewportProps) => {
        setViewport(viewportProps);
    };
    const handleMapPointChange = (id: StopsDto['id']) => (
        pointValue: boolean
    ) => {
        if (pointValue) {
            onChange(id);
            onAccept(id);

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

    const handleLoad = () => {
        if (endpoints.length >= 2) {
            const newViewport = new WebMercatorViewport(viewport);
            const [minLng, minLat, maxLng, maxLat] = getBoundingBox(endpoints);
            const { longitude, latitude, zoom } = newViewport.fitBounds(
                [[minLat, minLng], [maxLat, maxLng]],
                { padding: 40 }
            );

            setViewport({
                ...viewport,
                longitude,
                latitude,
                zoom,
                transitionDuration: 500,
            });
        }
    };

    return (
        <div>
            <MapGL
                {...viewport}
                width={windowSize.width}
                height={windowSize.height}
                mapboxApiAccessToken={process.env.MAPBOX_TOKEN}
                onViewportChange={handleViewportChange}
                mapStyle={process.env.MAPBOX_STYLE}
                onLoad={handleLoad}
            >
                {endpoints.map(endpoint => (
                    <Marker
                        className={classes.marker}
                        latitude={endpoint.latitude}
                        longitude={endpoint.longitude}
                        offsetLeft={-18}
                        offsetTop={-18}
                        key={endpoint.id}
                    >
                        <MapPoint
                            open={value === endpoint.id}
                            onChange={handleMapPointChange(endpoint.id)}
                            tooltip={endpoint.desc}
                        />
                    </Marker>
                ))}
            </MapGL>
        </div>
    );
};
