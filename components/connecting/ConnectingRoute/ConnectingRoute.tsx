import React, { FC } from 'react';
import Box from '@material-ui/core/Box';
import { makeStyles, Theme } from '@material-ui/core/styles';

import { Typo } from 'components/Typo/Typo';

const useStyles = makeStyles(
    (theme: Theme) => ({
        /* Styles applied to the root element. */
        root: {},
        /* Styles applied to the route `div` element. */
        route: {
            display: 'flex',

            '& ~ &': {
                marginTop: theme.spacing(1),
            },
        },
        direction: {
            flexDirection: 'column',
        },
    }),
    { name: 'ConnectingRoute' }
);

type ConnectingRouteProps = {
    /* ISO 8601 */
    departureCity: string;
    departureStop?: string;
    /* ISO 8601 */
    arrivalCity: string;
    arrivalStop?: string;
};

/**
 * @source components/DesktopRoute
 */
export const ConnectingRoute: FC<ConnectingRouteProps> = props => {
    const { departureCity, departureStop, arrivalCity, arrivalStop } = props;
    const classes = useStyles();

    return (
        <div className={classes.root}>
            <div className={classes.route}>
                <Box className={classes.direction}>
                    <Typo variant="body2">{departureCity}</Typo>

                    {departureStop ? (
                        <Typo variant="caption" color="textSecondary">
                            {departureStop}
                        </Typo>
                    ) : null}
                </Box>
            </div>

            <div className={classes.route}>
                <Box className={classes.direction}>
                    <Typo
                        variant="body2"
                        color={arrivalStop ? 'textPrimary' : 'textSecondary'}
                    >
                        {arrivalCity}
                    </Typo>

                    {arrivalStop ? (
                        <Typo variant="caption" color="textSecondary">
                            {arrivalStop}
                        </Typo>
                    ) : null}
                </Box>
            </div>
        </div>
    );
};
