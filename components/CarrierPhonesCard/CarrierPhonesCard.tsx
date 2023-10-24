import React, { FC } from 'react';
import clsx from 'clsx';
import { makeStyles, Theme } from '@material-ui/core/styles';

import { CarrierPhonesList, CarrierPhonesProps } from '../CarrierPhonesList';
import { AtlasTheme } from 'typings/atlas-theme';

const useStyles = makeStyles(
    (theme: Theme & AtlasTheme) => ({
        /* Styles applied to the root element. */
        root: {
            boxShadow: theme.atlas.shadows.bottom,
            borderRadius: theme.shape.borderRadius,
        },
    }),
    { name: 'CarrierPhonesCard' }
);

type Props = CarrierPhonesProps;

export const CarrierPhonesCard: FC<Props> = props => {
    const { className, ...other } = props;
    const classes = useStyles();

    return (
        <div className={clsx(classes.root, className)}>
            <CarrierPhonesList {...other} />
        </div>
    );
};
