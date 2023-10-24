import React, { FC, useEffect, useState } from 'react';
import Box from '@material-ui/core/Box';
import LinearProgress from '@material-ui/core/LinearProgress';
import { makeStyles, Theme } from '@material-ui/core/styles';
import Countdown, { CountdownTimeDelta } from 'react-countdown';
import padStart from 'lodash/padStart';

import { Button, Props as ButtonProps } from '../ui/Button/Button';
import CircularProgress from '@material-ui/core/CircularProgress';
import { AtlasTheme } from 'typings/atlas-theme';

type Props = ButtonProps & {
    /** Timestamp in the future **/
    date: number;
    /** Callback when countdown ends **/
    onComplete?: () => void;
    loading?: boolean;
};

const useStyles = makeStyles(
    (theme: Theme & AtlasTheme) => ({
        body: {
            zIndex: 1,
        },
        title: {
            ...theme.atlas.typography.body1,
        },
        subtitle: {
            ...theme.atlas.typography.caption,
            fontWeight: 400,
            opacity: 0.64,
        },
        progress: {
            position: 'absolute',
            left: 0,
            right: 0,
            bottom: 0,
            top: 0,
            height: 'auto',
            backgroundColor: 'transparent',

            '& .MuiLinearProgress-bar': {
                backgroundColor: '#000',
                opacity: 0.12,
            },
        },
        circularProgress: {
            marginRight: theme.spacing(2),
        },
    }),
    { name: 'CountdownButton' }
);

const formatTime = (totalSeconds: number) => {
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;

    const mm = padStart(minutes.toString(), 2, '0');
    const ss = padStart(seconds.toString(), 2, '0');

    return `${mm}:${ss}`;
};

export const CountdownButton: FC<Props> = props => {
    const {
        children,
        color = 'primary',
        date,
        onComplete = () => {},
        loading,
        ...rest
    } = props;
    const classes = useStyles();
    const [milliseconds, setMilliseconds] = useState(date - Date.now());
    const [progressValue, setProgressValue] = useState(100);

    const handleTick = (delta: CountdownTimeDelta) => {
        setProgressValue((delta.total * 100) / milliseconds);
    };

    const handleComplete = () => {
        setProgressValue(0);
        onComplete();
    };

    useEffect(() => {
        setMilliseconds(date - Date.now());
    }, [date]);

    return (
        <Button variant="contained" color={color} {...rest}>
            {loading ? (
                <div className={classes.circularProgress}>
                    <CircularProgress color="inherit" size={24} />
                </div>
            ) : null}

            <LinearProgress
                variant="determinate"
                value={progressValue}
                className={classes.progress}
            />
            <div className={classes.body}>
                <Box className={classes.title}>{children}</Box>
                <Box className={classes.subtitle}>
                    <Countdown
                        date={date}
                        key={date}
                        onTick={handleTick}
                        onComplete={handleComplete}
                        renderer={({ total }) => formatTime(total / 1000)}
                    />
                </Box>
            </div>
        </Button>
    );
};
