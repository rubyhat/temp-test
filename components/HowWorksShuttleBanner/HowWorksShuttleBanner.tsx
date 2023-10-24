import React from 'react';
import clsx from 'clsx';
import { makeStyles, Theme } from '@material-ui/core/styles';

import { AtlasTheme } from 'typings/atlas-theme';

const useStyles = makeStyles(
    (theme: Theme & AtlasTheme) => ({
        /* Styles applied to the root element. */
        banner: {
            padding: '18px 15px 0 15px',
            background:
                'linear-gradient(69.64deg, #3691FE 3.38%, #3ACAFF 100%)',
            borderRadius: '8px',
            boxShadow: '0px 6px 12px rgba(8, 78, 104, 0.18)',
        },
        bannerHeader: {},
        bannerTitle: {
            maxWidth: '180px',
            fontSize: '20px',
            fontWeight: 700,
            margin: 0,
            color: '#fff',
        },
        bannerBody: {},
        bannerList: {
            padding: '15px 0',
            margin: '0',
        },
        bannerListItem: {
            color: '#fff',
            fontSize: '15px',
            fontWeight: 500,
            marginLeft: '15px',
        },
        arrow: {
            marginLeft: '8px',
        },
        shuttleImgWrap: {
            textAlign: 'right',
        },
        shuttleImg: {
            marginLeft: 'auto',
        },
    }),
    { name: 'HowWorksShuttleBanner' }
);

export const HowWorksShuttleBanner = () => {
    const classes = useStyles();
    return (
        <div className={classes.banner}>
            <div className={classes.bannerHeader}>
                <h6 className={classes.bannerTitle}>
                    Как работает шеринг такси?
                    <img
                        className={classes.arrow}
                        src="/static/img/shuttles/icon-arrow.svg"
                        alt="icon-arrow"
                    />
                </h6>
            </div>
            <div className={classes.bannerBody}>
                <ol type="1" className={classes.bannerList}>
                    <li className={classes.bannerListItem}>
                        Выбираете откуда и куда хотите поехать.
                    </li>
                    <li className={classes.bannerListItem}>
                        Выбираете нужную дату и время отправлеения
                    </li>
                    <li className={classes.bannerListItem}>
                        Мы ищем вам машину и показываем время прибытия машины
                    </li>
                    <li className={classes.bannerListItem}>
                        Выбираете адрес отправления
                    </li>
                    <li className={classes.bannerListItem}>
                        Подтверждаете ваш заказ и отправляетесь
                    </li>
                </ol>
                <p className={classes.shuttleImgWrap}>
                    <img
                        className={classes.shuttleImg}
                        src="/static/img/shuttles/img-shuttle-car-1x.webp"
                        srcSet="/static/img/shuttles/img-shuttle-car-2x.webp 2x"
                        alt="shuttle-banner"
                    />
                </p>
            </div>
        </div>
    );
};
