import React, {
    FC,
    RefObject,
    useCallback,
    useEffect,
    useMemo,
    useRef,
    useState,
} from 'react';
import CircularProgress from '@material-ui/core/CircularProgress';
import debounce from 'lodash/debounce';
import { GeolocationControl, Map, YMaps, YMapsApi } from 'react-yandex-maps';
import { Observable } from 'rxjs';
import { makeStyles, Theme } from '@material-ui/core/styles';
import { useDispatch } from 'react-redux';

import useElementSize from 'components/useElementSize';
import { D2DMapObjectManager } from 'components/d2d/D2DMapObjectManager';
import { D2DMapPin } from 'components/d2d/D2DMapPin';
import { GeolocationStatus } from 'store/geolocation';
import { StopsDto } from 'swagger/client';
import { bookingNearestStopByGeolocationAttempt } from 'store/booking-geolocation';
import { getBoundingBox, nearestStop } from 'utils/map';
import { nearestStopByGeolocation } from 'utils/geolocation';
import { useBookingGeolocation } from 'hooks/useBookingGeolocation';
import { useGeolocation } from 'hooks/useGeolocation';
import { useTranslation } from 'i18n';
import { distance } from '@turf/turf';
import { ConnectingSeoBlock } from 'components/connecting/ConnectingSeoBlock';
const useStyles = makeStyles(
    (theme: Theme) => ({
        /* Styles applied to the root element. */
        root: {
            position: 'relative',
            height: '100%',
        },
        D2DMapPinContainer: {
            position: 'absolute',
            top: 0,
            right: 0,
            bottom: 0,
            left: 0,

            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-around',

            pointerEvents: 'none', // we can't touch the map while container is over the map
        },
        D2DMapPin: {},
        circularProgressContainer: {
            position: 'absolute',
            top: 0,
            right: 0,
            bottom: 0,
            left: 0,

            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-around',

            pointerEvents: 'none',
        },
    }),
    { name: 'D2DStopsMap' }
);

export type D2DStopsMapProps = {
    value: StopsDto['id'] | null;
    stops: StopsDto[];
    defaultLatLng?: { latitude: number; longitude: number }; // для начальной позиции карты
    defaultZoom?: number;
    onChange: (value: StopsDto['id'] | null) => void;
    onAccept?: (value: StopsDto['id']) => void;
    onDragEnd?: (lat: number, lng: number) => void;
    onMagnetizeEnd?: (stop?: StopsDto) => void;
    onMouseDown?: (e: Event) => void;
    containerEl: RefObject<HTMLElement | Window | null>;
};

/**
 * Время ожидания перед примагничиванием после свайпа.
 * Нужно для того чтобы пользователь смог свайпнуть карту несколько раз.
 */
const magnetizeInterval = 750;

/**
 * Длительность анимации примагничивания карты.
 */
const magnetizeAnimationDuration = 250;

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
    'geolocation',
];

type DraggingInstance = {
    preventDragEvents: boolean;
};

export const D2DStopsMap: FC<D2DStopsMapProps> = props => {
    const {
        value: valueProp,
        stops = [],
        defaultLatLng = {
            // Минск
            latitude: 53.904541,
            longitude: 27.561523,
        },
        defaultZoom = 9,
        onChange,
        onAccept = () => {},
        onDragEnd,
        onMagnetizeEnd,
        onMouseDown,
        containerEl,
    } = props;

    const classes = useStyles();
    const dispatch = useDispatch();
    const { t } = useTranslation();

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
    /**
     * Карта движется или признак летающего пина.
     */
    const [dragging, setDragging] = useState(false);
    const draggingInstance = useRef<DraggingInstance>({
        preventDragEvents: false,
    });

    const { current: isControlled } = useRef(valueProp !== undefined);
    const [valueState, setValue] = useState<StopsDto['id'] | null>(null);
    const value = isControlled ? valueProp : valueState;

    const windowSize = useElementSize(containerEl.current, [
        containerEl.current,
    ]);

    // Примагничивание пина к остановке
    const magnetizeStop = useCallback(
        debounce((stop: StopsDto) => {
            if (!mapInstance) return;

            const { latitude, longitude } = stop;

            // Примагнчивание пина тригерит события перетаскивания карты,
            // буд-то это делает пользователь. Вырубим события на время
            // примагничивания.
            draggingInstance.current.preventDragEvents = true;

            try {
                mapInstance
                    .setCenter([latitude, longitude], undefined, {
                        checkZoomRange: true,
                        duration: magnetizeAnimationDuration,
                    })
                    .catch((err: Error) => {
                        console.warn(
                            '[D2DStopsMap] Что-то пошло не так при вызове mapInstance.setCenter()'
                        );
                        console.log(err);
                    })
                    .then(() => {
                        draggingInstance.current.preventDragEvents = false;
                        setDragging(false);
                    });
            } catch (err) {
                // ATLASDEV-1259: Яндекс Карты: Квантовый взрыв
                // Если выполнить `router.push()` и после `mapInstance.setCenter()`
                // всплывет ошибка:
                // `TypeError: Cannot read property 'fromGlobalPixels' of undefined`.
                //
                // Обернул в try/catch. Ошибку можно проигнорировать.
                // Карта остается работоспособной.
                console.log(err);
            }
        }, magnetizeInterval),
        [!!mapInstance]
    );

    const handleMapPointChange = (id: StopsDto['id'] | null) => {
        if (id) {
            const currStop = stops.find((stop: StopsDto) => stop.id === id);

            if (!currStop) return;

            if (onMagnetizeEnd) {
                onMagnetizeEnd(currStop);
            }
            onChange(id);
            onAccept(id);

            if (!isControlled) {
                setValue(id);
            }
            magnetizeStop(currStop);
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

    useEffect(() => {
        // Ждем инициализации карты
        if (!mapInstance || !mapLoaded) return;

        if (stops.length >= 2) {
            const [minLng, minLat, maxLng, maxLat] = getBoundingBox(stops);

            // Устанавливает центр и коэффициент масштабирования карты.
            // Если текущий zoomRange не совпадает с zoomRange для нового центра карты,
            // могут быть отображены серые тайлы в случае, если область показа очень мала.
            // Чтобы избежать этой проблемы, используйте опцию checkZoomRange.
            mapInstance
                .setBounds([[minLng, minLat], [maxLng, maxLat]], {
                    // Эта штука делает лишний запрос на сервер. Лучше не включать.
                    // https://yandex.ru/dev/maps/jsapi/doc/2.1/ref/reference/Map.html#method_detail__setBounds-param-options.checkZoomRange
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
                        `[D2DStopsMap] Что-то пошло не так при вызове map.setBounds()`
                    );
                    console.log(err);
                });
        } else {
            setRenderWithoutBounds(true);
        }
    }, [mapInstance, mapLoaded]);

    // Примагничивание при изменении остановки из вне компонента.
    useEffect(() => {
        if (!mapInstance) return;
        if (!value) return;
        if (!boundsWasSet && !renderWithoutBounds) return;

        const currStop = stops.find(stop => stop.id === value);
        if (!currStop) return;

        magnetizeStop(currStop);
    }, [value, boundsWasSet, renderWithoutBounds]);

    // Примагничивание обратно к той же остановки если
    // других остановок поблизости не оказалось.
    useEffect(() => {
        if (dragging) return; // ничего не делаем если перетаскивание не завершено

        if (!mapInstance) return;

        const [lat, lng] = mapInstance.getCenter();
        const [[lat1, lng1], [lat2, lng2]] = mapInstance.getBounds();

        const viewPort = distance([lat1, lng1], [lat2, lng2], {
            units: 'kilometers',
        });

        const currStop = nearestStop({ lat, lng }, stops);

        if (!currStop) return;

        const distanceToStop = distance(
            [lat, lng],
            [currStop.latitude, currStop.longitude],
            {
                units: 'kilometers',
            }
        );

        if (distanceToStop < 0.075 * viewPort) {
            magnetizeStop(currStop);
            if (onMagnetizeEnd) {
                onMagnetizeEnd(currStop);
            }
        } else {
            if (onMagnetizeEnd) {
                onMagnetizeEnd();
            }
        }
    }, [dragging, !!mapInstance]);

    useEffect(() => {
        if (!mapInstance) return;
        const currStop = stops.find((stop: StopsDto) => stop.id === value);
        if (!currStop) return;

        magnetizeStop(currStop);
        if (onMagnetizeEnd) {
            onMagnetizeEnd(currStop);
        }
    }, [!!mapInstance]);

    /**
     * Attach map `dragEnd` event
     *
     * Полный список событий:
     * https://yandex.com/dev/maps/jsapi/doc/2.1/ref/reference/IDomEventEmitter.html#IDomEventEmitter__events-summary
     *
     * Про эмуляцию событий (для кроссплатформенности):
     * https://yandex.ru/dev/maps/jsapi/doc/2.1/ref/reference/domEvent.manager.html
     *
     * @see https://yandex.ru/dev/maps/jsapi/doc/2.1/ref/reference/Map.html#field_detail__behaviors
     * @see https://yandex.ru/dev/maps/jsapi/doc/2.1/ref/reference/map.behavior.Manager.html?lang=ru
     */
    const handleDragStart = useCallback(() => {
        if (draggingInstance.current.preventDragEvents) return;

        setDragging(true);
    }, [!!mapInstance]);

    useEffect(() => {
        if (!mapInstance) return;

        mapInstance.events.add('mousedown', handleDragStart);

        return () => {
            mapInstance.events.remove('mousedown', handleDragStart);
        };
    }, [!!mapInstance, handleDragStart]);

    const handleDragEnd = useCallback(() => {
        if (!mapInstance) return;
        if (draggingInstance.current.preventDragEvents) return;

        const [lat, lng] = mapInstance.getCenter();

        if (onDragEnd) {
            onDragEnd(lat, lng);
        }
        setDragging(false);
    }, [!!mapInstance]);

    /**
     * Пайпинг `mousedown + (mouseleave + actionend)`.
     *
     * Если свайпнуть с ускорением мы получим координаты в момент убирания пальца,
     * хотя карта еще движется по инерции, и правильные координаты окажутся дальше.
     *
     * После `mousedown` нужно подписаться на событие `mouseleave + actionend` (порядок не важен)
     * и использовать координаты полученные после остановки движения карты.
     */
    const dragendObservable = useMemo(() => {
        return new Observable(subscriber => {
            if (!mapInstance) {
                subscriber.complete();
                return;
            }

            let mousedownTriggered = false;
            let mouseleaveTriggered = false;
            let actionendTriggered = false;

            function resetEvents() {
                mousedownTriggered = false;
                mouseleaveTriggered = false;
                actionendTriggered = false;
            }

            function onMouseDown() {
                mousedownTriggered = true;
                // Reset events
                mouseleaveTriggered = false;
                actionendTriggered = false;
            }

            function onMouseLeave(e: Event) {
                mouseleaveTriggered = true;

                if (
                    mousedownTriggered &&
                    mouseleaveTriggered &&
                    actionendTriggered
                ) {
                    resetEvents();
                    subscriber.next(e);
                }
            }
            function onActionEnd(e: Event) {
                actionendTriggered = true;
                if (mousedownTriggered && actionendTriggered) {
                    resetEvents();
                    subscriber.next(e);
                }
            }
            function onMouseUp(e: Event) {
                if (mousedownTriggered || actionendTriggered) {
                    resetEvents();
                    subscriber.next(e);
                }
            }

            mapInstance.events.add('mouseup', onMouseUp); // ontouchstart
            mapInstance.events.add('mousedown', onMouseDown); // ontouchstart
            mapInstance.events.add('mouseleave', onMouseLeave); // ontouchend
            mapInstance.events.add('actionend', onActionEnd); // окончание движения карты

            return () => {
                mapInstance.events.remove('mouseup');
                mapInstance.events.remove('mousedown');
                mapInstance.events.remove('mouseleave');
                mapInstance.events.remove('actionend');
            };
        });
    }, [!!mapInstance]);

    useEffect(() => {
        if (!mapInstance) return;

        const subscription$ = dragendObservable.subscribe(e => {
            handleDragEnd();
        });

        return () => {
            subscription$.unsubscribe();
        };
    }, [!!mapInstance, handleDragEnd]);

    useEffect(() => {
        if (!mapInstance) return;
        if (!onMouseDown) return;

        mapInstance.events.add('mousedown', onMouseDown);

        return () => {
            mapInstance.events.remove('mousedown', onMouseDown);
        };
    }, [!!mapInstance, onMouseDown]);

    // Определение ближайшей остановки по геолокации
    const geolocation = useGeolocation();
    const { nearestStopByGeolocationAttempt } = useBookingGeolocation();

    useEffect(() => {
        if (!mapInstance) return;
        if (!boundsWasSet && !renderWithoutBounds) return; // ждем установки границ карты
        if (nearestStopByGeolocationAttempt) return; // если пытались определить раньше

        // Если получили гео-данные пользователя ищем остановку в радиусе 2 км.
        if (
            geolocation.status === GeolocationStatus.Success &&
            geolocation.position
        ) {
            const { latitude, longitude } = geolocation.position.coords;

            const nearestStop = nearestStopByGeolocation(
                {
                    latitude,
                    longitude,
                },
                stops
            );

            if (nearestStop) {
                handleMapPointChange(nearestStop.id);
            }

            // пометим в стор что уже пытались,
            // и больше не возвращаться к этому
            // до конца бронирования
            dispatch(bookingNearestStopByGeolocationAttempt());
        }
    }, [
        !!mapInstance,
        boundsWasSet,
        renderWithoutBounds,
        geolocation.status,
        nearestStopByGeolocationAttempt,
    ]);

    return (
        <div className={classes.root}>
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
                        center: [
                            defaultLatLng.latitude,
                            defaultLatLng.longitude,
                        ],
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
                        <D2DMapObjectManager
                            ymaps={ymaps}
                            map={mapInstance}
                            stops={stops}
                            objectId={value || null}
                            onChange={handleMapPointChange}
                        />
                    ) : null}

                    <GeolocationControl
                        data={{ content: t('whereAmI') }}
                        options={{ float: 'right' }}
                    />
                </Map>
            </YMaps>

            {!mapInstance ? (
                <div className={classes.circularProgressContainer}>
                    <CircularProgress />
                </div>
            ) : null}

            {mapInstance ? (
                <div className={classes.D2DMapPinContainer}>
                    <D2DMapPin
                        className={classes.D2DMapPin}
                        flightMode={dragging}
                    />
                </div>
            ) : null}
        </div>
    );
};
