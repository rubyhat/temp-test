import React, { FC } from 'react';
import { makeStyles, Theme } from '@material-ui/core/styles';
import parseISO from 'date-fns/parseISO';

import { Typo } from '../Typo/Typo';
import { format } from 'utils/date';
import Box from '@material-ui/core/Box';
import { useSAAS } from 'hooks/useSAAS';

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
            marginLeft: theme.spacing(2),
            flexDirection: 'column',
        },
        city: {},
        time: {},
    }),
    { name: 'DesktopRoute' }
);

type Props = {
    /* ISO 8601 */
    departureDate: string;
    departureCity: string;
    departureStop?: string;
    departureInfo?: string;
    /* ISO 8601 */
    arrivalDate: string;
    arrivalCity: string;
    arrivalStop?: string;
    arrivalInfo?: string;
    freeSeats?: number;
    compact?: boolean;
};

export const DesktopRoute: FC<Props> = props => {
    const {
        departureDate,
        departureCity,
        departureStop,
        departureInfo,
        arrivalDate,
        arrivalCity,
        arrivalStop,
        arrivalInfo,
        freeSeats,
        compact,
    } = props;
    const classes = useStyles();
    const { isMioTaxi } = useSAAS();

    const localDeparture = parseISO(departureDate);
    const departureTime = format(localDeparture, 'HH:mm');

    const localArrival = parseISO(arrivalDate);
    const arrivalTime = format(localArrival, 'HH:mm');

    const boxDisplay = {
        md: compact ? 'none' : 'inherit',
        lg: 'inherit',
    };

    return (
        <div className={classes.root}>
            <div className={classes.route}>
                <div className={classes.time}>
                    <Typo weight="bold" variant="body2">
                        {departureTime}
                    </Typo>
                </div>
                {freeSeats !== 0 && (
                    <Box display={boxDisplay} className={classes.direction}>
                        <Typo variant="body2">{departureCity}</Typo>
                        <Typo variant="caption" color="textSecondary">
                            {departureStop}
                        </Typo>
                        {departureInfo ? (
                            <Typo variant="caption" color="textSecondary">
                                {departureInfo}
                            </Typo>
                        ) : null}
                    </Box>
                )}
            </div>

            {freeSeats !== 0 && (
                <div className={classes.route}>
                    <div className={classes.time}>
                        <Typo
                            variant="body2"
                            color={
                                arrivalStop ? 'textPrimary' : 'textSecondary'
                            }
                            style={
                                isMioTaxi
                                    ? {
                                          position: 'relative',
                                          zIndex: -1,
                                          opacity: 0,
                                      }
                                    : {}
                            }
                        >
                            {arrivalTime}
                        </Typo>
                    </div>
                    <Box display={boxDisplay} className={classes.direction}>
                        <Typo
                            variant="body2"
                            color={
                                arrivalStop ? 'textPrimary' : 'textSecondary'
                            }
                            style={
                                isMioTaxi
                                    ? {
                                          marginLeft: '3px',
                                      }
                                    : {}
                            }
                        >
                            {arrivalCity}
                        </Typo>
                        <Typo
                            variant="caption"
                            color="textSecondary"
                            style={
                                isMioTaxi
                                    ? {
                                          position: 'relative',
                                          zIndex: -1,
                                          opacity: 0,
                                      }
                                    : {}
                            }
                        >
                            {arrivalStop}
                        </Typo>
                        {arrivalInfo ? (
                            <Typo variant="caption" color="textSecondary">
                                {arrivalInfo}
                            </Typo>
                        ) : null}
                    </Box>
                </div>
            )}
        </div>
    );
};
