import React, { useState } from 'react';
import { storiesOf } from '@storybook/react';
import { makeStyles, Theme } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Paper from '@material-ui/core/Paper';

import { Route } from 'components/Route/Route';
import { MobileDialog } from './MobileDialog';
import { RideDetailsList } from 'components/RideDetailsList';
import { RideBenefitsList } from 'components/RideBenefitsList';
import { details } from 'components/RideDetailsList/RideDetailsList.story';
import { benefits } from 'components/RideBenefitsList/RideBenefits.story';

const useStyles = makeStyles((theme: Theme) => ({
    route: {
        marginTop: theme.spacing(2),
        padding: theme.spacing(3, 2),
    },
    list: {
        marginTop: theme.spacing(2),
        backgroundColor: '#FFF',
    },
}));

storiesOf('ui/MobileDialog', module).add('default', () => {
    const Component = () => {
        const classes = useStyles();
        const [open, setOpen] = useState(false);

        const handleClose = () => {
            document.body.style.overflow = 'auto';
            setOpen(false);
        };
        const handleClick = () => {
            setOpen(true);
        };

        return (
            <>
                <Button variant="outlined" onClick={handleClick}>
                    Open
                </Button>

                <MobileDialog
                    open={open}
                    onClose={handleClose}
                    title={'Москва – Санкт-Петербург'}
                    subtitle={'15 мая, Ср'}
                    textCenter
                >
                    <Paper className={classes.route} elevation={0} square>
                        <Route
                            departureDate="2019-12-24T08:00:00"
                            arrivalDate="2019-12-25T13:00:00"
                        />
                    </Paper>

                    <RideDetailsList items={details} className={classes.list} />

                    <RideBenefitsList title="Удобства" items={benefits} />
                </MobileDialog>
            </>
        );
    };

    return <Component />;
});
