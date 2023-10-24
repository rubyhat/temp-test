import React, { FC, useRef, useState } from 'react';
import { makeStyles, Theme } from '@material-ui/core/styles';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import clsx from 'clsx';

import { Tooltip } from '../ui/Tooltip';
import theme from 'themes/default';
import { AtlasTheme } from 'typings/atlas-theme';

const useStyles = makeStyles(
    (theme: Theme & AtlasTheme) => ({
        /* Styles applied to the point `div` element. */
        point: {
            width: 24,
            height: 24,
            backgroundColor: '#FFF',
            border: `6px solid #000`,
            boxShadow: theme.atlas.shadows.bottom,
            borderRadius: '50%',
            cursor: 'pointer',
            '&:hover': {
                borderColor: theme.palette.primary.main,
            },
        },
        /* Pseudo-class applied to the point `div` element if `open={true}`. */
        pointActive: {
            borderColor: theme.palette.primary.main,
        },
    }),
    { name: 'MapPoint' }
);

type Props = {
    open?: boolean;
    onChange?: (value: boolean) => void;
    tooltip: string;
};

export const MapPoint: FC<Props> = props => {
    const { tooltip, onChange, open: openProp } = props;
    const classes = useStyles();
    const isDesktop = useMediaQuery(theme.breakpoints.up('md'));

    const { current: isControlled } = useRef(openProp != null);
    const [openState, setOpen] = useState(false);
    const open = isControlled ? openProp : openState;

    const [hover, setHover] = useState(false);

    const handleTooltipToggle = () => {
        if (onChange) {
            onChange(!open);
        }

        if (!isControlled) {
            setOpen(!open);
        }
    };

    const handleTooltipHover = () => {
        if (isDesktop) {
            setHover(true);
        }
    };
    const handleTooltipBlur = () => {
        if (isDesktop) {
            setHover(false);
        }
    };

    return (
        <Tooltip
            open={open || hover}
            onClick={handleTooltipToggle}
            onOpen={handleTooltipHover}
            onClose={handleTooltipBlur}
            title={tooltip}
            disableTouchListener
            disableFocusListener
            PopperProps={{
                disablePortal: true,
            }}
        >
            <div
                className={clsx(classes.point, {
                    [classes.pointActive]: open,
                })}
            />
        </Tooltip>
    );
};
