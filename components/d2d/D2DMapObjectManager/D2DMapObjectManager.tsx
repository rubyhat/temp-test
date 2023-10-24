import React, { FC, useCallback, useEffect, useMemo } from 'react';
import { makeStyles, Theme, useTheme } from '@material-ui/core/styles';
import { YMapsApi } from 'react-yandex-maps';
import { FeatureCollection } from 'geojson';

import { StopsDto } from 'swagger/client';
import { AtlasTheme } from 'typings/atlas-theme';

const useStyles = makeStyles(
    (theme: Theme & AtlasTheme) => ({
        /* Styles applied to the root element. */
        root: {},

        /* Стили хинта */
        hintLayout: {
            position: 'absolute',
            boxShadow: theme.atlas.shadows.bottom,

            backgroundColor: theme.palette.common.white,
            color: theme.palette.common.black,

            fontSize: theme.atlas.typography.caption.fontSize,
            borderRadius: theme.shape.borderRadius,
            padding: theme.spacing(1, 2),
        },

        /* Стили балуна */
        balloonLayout: {
            position: 'absolute',
        },
        balloonContainer: {},
        balloonContent: {
            backgroundColor: theme.palette.primary.main,
            color: theme.palette.common.white,

            fontSize: theme.atlas.typography.caption.fontSize,
            borderRadius: theme.shape.borderRadius,
            padding: theme.spacing(1, 2),
        },
    }),
    { name: 'D2DMapObjectManager' }
);

type D2DMapObjectManagerProps = {
    /**
     * ID выбранного объекта.
     */
    objectId: string | null;
    onChange: (objectId: string | null) => void;
    /** Yandex.Maps API instance **/
    ymaps: YMapsApi;
    /** Yandex.Maps Object Map instance **/
    map: any;
    /** Остановки **/
    stops: StopsDto[];
};

export const D2DMapObjectManager: FC<D2DMapObjectManagerProps> = props => {
    const { ymaps, map, objectId: objectIdProp, onChange, stops } = props;
    const classes = useStyles();
    const theme = useTheme();

    /**
     * Стили хинта. При наведении курсора на десктопе.
     */
    const hintLayout = ymaps.templateLayoutFactory.createClass(`
        <div class="${classes.hintLayout}">$[properties.hintContent]</div>
    `);

    /**
     * Стили балуна и логика автопозиционирования.
     */
    const balloonLayout = ymaps.templateLayoutFactory.createClass(
        `
        <div class="${classes.balloonLayout}">
            <div class="${classes.balloonContainer}">
                $[[options.contentLayout observeSize minWidth=80 maxWidth=120 maxHeight=80]]
            </div>
        </div>
        `,
        {
            /**
             * Переопределяем функцию build и сохраняем ссылку
             * на HTML элемент балуна.
             */
            build() {
                // Сначала вызываем метод build родительского класса.
                // Или так `balloonContentLayout.superclass.build.call(this)`.
                // В примерах находил и такой вариант. Не уверен есть ли разница.
                this.constructor.superclass.build.call(this);

                const elements: HTMLElement[] = this.getParentElement().getElementsByClassName(
                    classes.balloonLayout
                );
                this._$element = elements[0];
            },

            /**
             * Аналогично переопределяем функцию clear, чтобы снять
             * прослушивание клика при удалении макета с карты.
             */
            clear() {
                balloonContentLayout.superclass.clear.call(this);
            },

            /**
             * Метод будет вызван системой шаблонов АПИ при изменении размеров вложенного макета.
             * @see https://api.yandex.ru/maps/doc/jsapi/2.1/ref/reference/IBalloonLayout.xml#event-userclose
             * @function
             * @name onSublayoutSizeChange
             */
            onSublayoutSizeChange() {
                balloonLayout.superclass.onSublayoutSizeChange.apply(
                    this,
                    arguments
                );

                if (!this._isElement(this._$element)) {
                    return;
                }

                this.applyElementOffset();

                this.events.fire('shapechange');
            },

            /**
             * Сдвигаем балун, чтобы "хвостик" указывал на точку привязки.
             * @see https://api.yandex.ru/maps/doc/jsapi/2.1/ref/reference/IBalloonLayout.xml#event-userclose
             * @function
             * @name applyElementOffset
             */
            applyElementOffset() {
                /**
                 * Неправильно определяет offsetWidth/offsetHeight.
                 * Пусть балун будет пока в правом углу от метки. Тоже норм.
                 * Метод оставлю поскольку он вызывается в других местах.
                 */
                // const left = -(this._$element.offsetWidth / 2);
                // const top = -this._$element.offsetHeight;
                //
                // this._$element.css({
                //     left,
                //     top,
                // });
            },

            /**
             * Используется для автопозиционирования (balloonAutoPan).
             * @see https://api.yandex.ru/maps/doc/jsapi/2.1/ref/reference/ILayout.xml#getClientBounds
             * @source https://yandex.ru/dev/maps/jsbox/2.1/balloon_autopan
             * @function
             * @name getClientBounds
             * @returns {Number[][]} Координаты левого верхнего и правого нижнего углов шаблона относительно точки привязки.
             */
            getShape() {
                if (!this._isElement(this._$element)) {
                    return balloonLayout.superclass.getShape.call(this);
                }

                // Альтернатива jQuery position().
                // Текущие значения {top: 0, left: 0}
                const position = {
                    top: this._$element.offsetTop,
                    left: this._$element.offsetLeft,
                };

                // Ширина и высота layout'а балуна
                const balloon = {
                    width: this._$element.offsetWidth,
                    height: this._$element.offsetHeight,
                };

                return new ymaps.shape.Rectangle(
                    new ymaps.geometry.pixel.Rectangle([
                        [position.left, position.top],
                        [
                            position.left + balloon.width,
                            position.top + balloon.height,
                        ],
                    ])
                );
            },
            /**
             * Проверяем наличие элемента (в ИЕ и Опере его еще может не быть).
             */
            _isElement(element?: HTMLElement) {
                return !!element;
            },
        }
    );

    /**
     * Создание макета содержимого балуна.
     */
    const balloonContentLayout = ymaps.templateLayoutFactory.createClass(
        `
            <div class="${classes.balloonContent}">$[properties.balloonContent]</div>
        `
    );

    /**
     * ObjectManager принимает только объекты FeaturedCollection.
     * Подгоним остановки под такой формат.
     */
    const featureCollection = useMemo<FeatureCollection>(
        () => ({
            type: 'FeatureCollection',
            features: stops.map(stop => ({
                type: 'Feature',
                id: stop.id,
                geometry: {
                    type: 'Point',
                    coordinates: [stop.latitude, stop.longitude],
                },
                properties: {
                    balloonContent: stop.desc,
                    hintContent: stop.desc, // хинт отображается только на десктопе при наведении курсора
                },
                options: {
                    /**
                     * Пресеты иконок.
                     * @see https://yandex.ru/dev/maps/jsapi/doc/2.1/ref/reference/option.presetStorage.html/
                     */

                    // preset: 'islands#circleIcon', // или 'islands#circleDotIcon'?
                    iconLayout: 'default#image',
                    iconImageHref: stop.dynamic
                        ? '/yandex-maps/placemark-green.svg'
                        : '/yandex-maps/placemark-blue.svg',
                    iconImageSize: [36, 36],
                    iconImageOffset: [-18, -18], // imageSize / 2
                    iconColor: theme.palette.common.black,
                },
            })),
        }),
        [stops]
    );

    const objectManager = useMemo(
        () =>
            new ymaps.ObjectManager({
                /**
                 * We want to control a balloon state with React,
                 * so we disable automatically opening the balloon on click.
                 */
                geoObjectOpenBalloonOnClick: false,

                /**
                 * Options for singular objects should be specified with the
                 * geoObject prefix. The list of options is specified in GeoObject.
                 * Note that the manager ignores the 'visible' option.
                 *
                 * See: https://yandex.com/dev/maps/jsapi/doc/2.1/ref/reference/ObjectManager.html/#ObjectManager__constructor-summary
                 */
                geoObjectBalloonLayout: balloonLayout,
                geoObjectBalloonContentLayout: balloonContentLayout,

                geoObjectHintLayout: hintLayout,

                // Не скрываем иконку при открытом балуне.
                geoObjectHideIconOnBalloonOpen: false,
                // И дополнительно смещаем балун, в правый нижний угол от иконки.
                geoObjectBalloonOffset: [10, 10],
            }),
        []
    );

    useEffect(() => {
        objectManager.add(featureCollection);
        map.geoObjects.add(objectManager);
    }, []);

    /**
     * Подписка на события открытие/закрытие балуна.
     *
     * См.: https://yandex.ru/dev/maps/jsapi/doc/2.1/ref/reference/ObjectManager.html
     */
    const clickCallback = useCallback((e: any) => {
        const objectId = e.get('objectId');
        onChange(objectId);
    }, []);
    const beforeUserCloseBalloonCallback = useCallback(() => {
        onChange(null); // не выбран не один объект
    }, []);
    useEffect(() => {
        objectManager.objects.events.add('click', clickCallback);

        // Если пользователь закроет балун по крестику.
        // В текущей реализации у пользователя нет такой
        // возможности (нет крестика 🙂). Как фича на будущее.
        objectManager.objects.balloon.events.add(
            'beforeuserclose',
            beforeUserCloseBalloonCallback
        );

        return () => {
            objectManager.objects.events.remove('click', clickCallback);
            objectManager.objects.balloon.events.remove(
                'beforeuserclose',
                beforeUserCloseBalloonCallback
            );
        };
    }, []);

    return null;
};
