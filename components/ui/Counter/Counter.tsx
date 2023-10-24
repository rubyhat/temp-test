import React, { FC } from 'react';
import Grid from '@material-ui/core/Grid';
import Fab from '@material-ui/core/Fab';
import AddIcon from '@material-ui/icons/Add';
import RemoveIcon from '@material-ui/icons/Remove';
import { useStyles } from './styles';

export type Props = {
    value: number;
    onChange?: (value: number) => void;
};

export const Counter: FC<Props> = props => {
    const { value, onChange } = props;
    const classes = useStyles();

    function decrementCounter() {
        const decremented = value - 1;

        if (decremented >= 0) {
            onChange && onChange(decremented);
        }
    }

    function incrementCounter() {
        onChange && onChange(value + 1);
    }

    const isDisabled = value <= 0;

    return (
        <Grid
            className={classes.grid}
            container
            direction="row"
            justify="space-between"
            alignItems="center"
        >
            <Fab
                className={classes.fab}
                color="primary"
                onClick={decrementCounter}
                disabled={isDisabled}
            >
                <RemoveIcon />
            </Fab>

            <div className={classes.text}>{value}</div>

            <Fab
                className={classes.fab}
                color="primary"
                onClick={incrementCounter}
            >
                <AddIcon />
            </Fab>
        </Grid>
    );
};
