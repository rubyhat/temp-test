import React, { FC } from 'react';
import clsx from 'clsx';
import { makeStyles } from '@material-ui/core/styles';

import { Typo } from 'components/Typo/Typo';
import { formatPhone, tel } from 'utils/phone';

const useStyles = makeStyles(
    theme => ({
        /* Styles applied to the root element. */
        root: {},
        item: {
            '& ~ &': {
                marginTop: theme.spacing(1),
            },
        },
    }),
    { name: 'DesktopTripCarrierPhones' }
);

type DesktopTripCarrierPhonesProps = {
    carrierPhones: string[];
    className?: string;
};

export const DesktopTripCarrierPhones: FC<
    DesktopTripCarrierPhonesProps
> = props => {
    const { carrierPhones, className } = props;
    const classes = useStyles();

    return (
        <div className={clsx(classes.root, className)}>
            {carrierPhones.map(phone => {
                const formattedPhone = formatPhone(phone);

                return (
                    <div key={phone} className={classes.item}>
                        <Typo>
                            <a href={`tel:${tel(formattedPhone)}`}>
                                {formattedPhone}
                            </a>
                        </Typo>
                    </div>
                );
            })}
        </div>
    );
};
