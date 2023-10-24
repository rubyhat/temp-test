import React, { FC, ReactNode } from 'react';
import Grid from '@material-ui/core/Grid';
import { makeStyles, Theme } from '@material-ui/core/styles';
import { AtlasTheme } from 'typings/atlas-theme';

const useStyles = makeStyles(
    (theme: Theme & AtlasTheme) => ({
        /* Styles applied to the root element. */
        root: {
            backgroundColor: theme.atlas.palette.background.blueGray4,
            paddingLeft: theme.spacing(2),
            paddingRight: theme.spacing(2),
            paddingTop: 6,
            paddingBottom: 6,
        },
        container: {
            display: 'flex',
            alignItems: 'center',
        },
        column1: {},
        column2: {
            marginLeft: theme.spacing(1),
        },
        column3: {
            textAlign: 'right',
        },
    }),
    { name: 'DesktopTripDetailsHeader' }
);

type DesktopTripDetailsHeaderProps = {
    column1: ReactNode;
    column2: ReactNode;
    column3: ReactNode;
};

export const DesktopTripDetailsHeader: FC<
    DesktopTripDetailsHeaderProps
> = props => {
    const { column1, column2, column3 } = props;
    const classes = useStyles();

    return (
        <div className={classes.root}>
            <div className={classes.container}>
                <Grid container alignItems="center">
                    <Grid item md={3}>
                        <div className={classes.column1}>{column1}</div>
                    </Grid>

                    <Grid item md={6}>
                        <div className={classes.column2}>{column2}</div>
                    </Grid>

                    <Grid item md={3}>
                        <div className={classes.column3}>{column3}</div>
                    </Grid>
                </Grid>
            </div>
        </div>
    );
};
