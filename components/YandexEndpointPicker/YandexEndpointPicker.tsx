import React, { FC, RefObject, useEffect, useRef, useState } from 'react';
import { Map, YMaps, YMapsApi } from 'react-yandex-maps';

import useElementSize from 'components/useElementSize';
import { StopsDto } from 'swagger/client';
import { YandexObjectManager } from 'components/YandexObjectManager';
import { getBoundingBox } from 'utils/map';

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

/**
 * Модульная система
 * @see https://yandex.ru/dev/maps/jsapi/doc/2.1/dg/concepts/modules.html
 */
const mapModules = [
    'ObjectManager',
    'objectManager.ObjectCollection',
    'objectManager.OverlayCollection',
    'objectManager.addon.objectsBalloon',
    'objectManager.addon.objectsHint',
    'shape.Rectangle',
    'geometry.pixel.Rectangle',
    'templateLayoutFactory',
];

export const YandexMapEndpointPicker: FC<Props> = props => {
    const {
        value: valueProp,
        endpoints = [],
        defaultLatitude = 53.904541, // Минск
        defaultLongitude = 27.561523, // Минск
        defaultZoom = 9,
        onChange = () => {},
        onAccept = () => {},
        containerEl,
    } = props;

    /** Ссылка на инстанс ymaps **/
    const [ymaps, setYmaps] = useState<YMapsApi | null>(null);
    /** Экземпляр карты `ymaps.Map` **/
    const [mapInstance, setMapInstance] = useState<any | null>(null);
    /** Карта была загружена в DOM **/
    const [mapLoaded, setMapLoaded] = useState(false);
    /** Границы были установлены (map.setBounds) **/
    const [boundsWasSet, toggleBoundsWasSet] = useState(false);
    /**
     * Если есть всего одна остановка, границы нельзя установить.
     * Используем это свойство как альтернативу `boundsWasSet`.
     */
    const [renderWithoutBounds, setRenderWithoutBounds] = useState(false);

    const { current: isControlled } = useRef(valueProp != null);
    const [valueState, setValue] = useState<StopsDto['id'] | null>(null);
    const value = isControlled ? valueProp : valueState;

    const windowSize = useElementSize(containerEl.current, [
        containerEl.current,
    ]);

    const handleMapPointChange = (id: StopsDto['id'] | null) => {
        if (id) {
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

    const handleLoad = (api: YMapsApi) => {
        setYmaps(api);
        setMapLoaded(true);
    };

    /**
     * Позиционируем границы так чтобы уместились все точки.
     */
    useEffect(() => {
        // Ждем инициализации карты
        if (!mapInstance || !mapLoaded) return;

        if (endpoints.length >= 2) {
            const [minLng, minLat, maxLng, maxLat] = getBoundingBox(endpoints);

            // Устанавливает центр и коэффициент масштабирования карты.
            // Если текущий zoomRange не совпадает с zoomRange для нового центра карты,
            // могут быть отображены серые тайлы в случае, если область показа очень мала.
            // Чтобы избежать этой проблемы, используйте опцию checkZoomRange.
            mapInstance
                .setBounds([[minLng, minLat], [maxLng, maxLat]], {
                    // Эта штука делает лишний запрос на сервер. Лучше не включать.
                    // https://yandex.ru/dev/maps/jsapi/doc/2.1/ref/reference/Map.html#method_detail__setBounds-param-options.checkZoomRange
                    //
                    // По непонятной причине
                    checkZoomRange: false,

                    // Эти опции судя по всему не имеют эффекта.
                    duration: 500, // Время анимации в миллисекундах.
                    timingFunction: 'ease', // или linear?
                })
                .then(() => {
                    toggleBoundsWasSet(true);
                })
                .catch((err: Error) => {
                    console.warn(
                        `[YandexEndpointPicker] Что-то пошло не так при вызове map.setBounds()`
                    );
                    console.error(err);
                });
        } else {
            setRenderWithoutBounds(true);
        }
    }, [mapInstance, mapLoaded]);

    return (
        <div>
            <YMaps
                query={{
                    apikey: process.env.YANDEX_MAPS_API_KEY,
                    /**
                     * Загружаем только нужные модули.
                     * См.: https://yandex.ru/dev/maps/jsapi/doc/2.1/dg/concepts/modules.html/#modules__load
                     *
                     * Важно: Модули также можно загружать через проп `modules` в компоненте <Map />
                     */
                    // load: 'package.full',
                }}
            >
                <Map
                    defaultState={{
                        center: [defaultLatitude, defaultLongitude],
                        // center: [55.831903, 37.411961], // Moscow
                        zoom: defaultZoom,
                    }}
                    width={windowSize.width}
                    height={windowSize.height}
                    onLoad={handleLoad}
                    modules={mapModules}
                    instanceRef={map => setMapInstance(map)}
                >
                    {ymaps &&
                    mapInstance &&
                    (boundsWasSet || renderWithoutBounds) ? (
                        <YandexObjectManager
                            ymaps={ymaps}
                            map={mapInstance}
                            stops={endpoints}
                            objectId={value || null}
                            onChange={handleMapPointChange}
                        />
                    ) : null}
                </Map>
            </YMaps>
        </div>
    );
};
