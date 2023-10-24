import React, { FC } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import ArrowForwardIcon from '@material-ui/icons/ArrowForward';

import { Typo } from 'components/Typo/Typo';
import { DestinationDto } from 'swagger/client';

const useStyles = makeStyles(
    theme => ({
        /* Styles applied to the root element. */
        root: {},
        container: {
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
        },
        fromCity: {},
        arrowIcon: {
            color: theme.palette.text.disabled,
            marginLeft: 4,
            marginRight: 4,
        },
        toCity: {
            textAlign: 'right',
        },
    }),
    { name: 'FromCityToCity' }
);

type FromCityToCityProps = {
    className?: string;
    fromCity: DestinationDto;
    toCity: DestinationDto;
};

export const FromCityToCity: FC<FromCityToCityProps> = props => {
    const { className, fromCity, toCity } = props;
    const classes = useStyles();

    return (
        <div className={classes.root}>
            <div className={classes.container}>
                <Typo
                    className={classes.fromCity}
                    weight="bold"
                    component="span"
                >
                    {fromCity.desc}
                </Typo>

                <ArrowForwardIcon className={classes.arrowIcon} />

                <Typo className={classes.toCity} weight="bold" component="span">
                    {toCity.desc}
                </Typo>
            </div>
        </div>
    );
};
