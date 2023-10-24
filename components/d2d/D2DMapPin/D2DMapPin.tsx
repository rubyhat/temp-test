import React, { FC, useEffect } from 'react';
import clsx from 'clsx';
import { makeStyles } from '@material-ui/core/styles';
import Fade from '@material-ui/core/Fade';
import { D2DMapPinHole } from './D2DMapPinHole';
import { D2DMapPinSvg } from './D2DMapPinSVG';

export const mapPinHeight = 60;
export const mapPinWidth = 40;

const useStyles = makeStyles(
    theme => ({
        /* Styles applied to the root element. */
        root: {
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
        },
        svg: {
            marginTop: -mapPinHeight,
            transition: 'margin 150ms',
        },
        /* Pseudo-class applied to the `svg` element if `flightMode={true}`. */
        flightMode: {
            marginTop: -mapPinHeight - 16,
            marginBottom: 16,
        },
        D2DMapPinHoleContainer: {
            lineHeight: 0, // fit SVG element height
        },
    }),
    { name: 'D2DMapPin' }
);

type D2DMapPinProps = {
    className?: string;
    flightMode?: boolean;
};

export const D2DMapPin: FC<D2DMapPinProps> = props => {
    const { className, flightMode } = props;
    const classes = useStyles();

    useEffect(() => {}, [flightMode]);

    return (
        <div className={clsx(classes.root, className)}>
            <D2DMapPinSvg
                className={clsx(classes.svg, {
                    [classes.flightMode]: flightMode,
                })}
            />

            <Fade in={flightMode}>
                <div className={classes.D2DMapPinHoleContainer}>
                    {/* Анимация не срабатывает с SVG элементом, поэтому обернул в контейнер */}
                    <D2DMapPinHole />
                </div>
            </Fade>
        </div>
    );
};
