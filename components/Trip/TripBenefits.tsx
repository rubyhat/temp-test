import React, { FC } from 'react';
import clsx from 'clsx';
import { fade, makeStyles, Theme } from '@material-ui/core/styles';

import {
    RideDto,
    RideDtoBenefitsEnum,
    SearchDto,
    SearchDtoBenefitsEnum,
} from 'swagger/client';
import { benefitsIconsMap } from 'utils/benefits';
import { getExecutorName } from 'utils/getExecutorName';
import { AtlasTheme } from 'typings/atlas-theme';

export const benefitsHiddenAreaHeight = 20;

const useStyles = makeStyles(
    (theme: Theme & AtlasTheme) => ({
        /* Styles applied to the root element. */
        root: {
            height: 48,
            borderRadius: theme.atlas.borderRadius.medium,
            backgroundColor: theme.atlas.palette.background.deepCold,
            boxShadow: theme.atlas.shadows.bottom,
        },
        container: {
            height: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            paddingLeft: theme.spacing(2),
            paddingRight: theme.spacing(2),

            position: 'relative',
            overflow: 'hidden',
        },
        /* Styles applied to the benefits `div` element. */
        benefits: {
            display: 'flex',
            alignItems: 'center',
        },
        /* Styles applied to the benefit `Icon` component. */
        benefitIcon: {
            fontSize: 16,
            color: theme.atlas.palette.text.minor,

            '& ~ &': {
                marginLeft: theme.spacing(1),
            },
        },
        /* Styles applied to the executorName `div` element. */
        executorName: {
            fontSize: theme.typography.caption.fontSize,
            color: theme.atlas.palette.text.minor,
            marginLeft: theme.spacing(1),
            whiteSpace: 'nowrap',
        },
        /* Fade gradient if executorName overflows container */
        fadeOverflow: {
            position: 'absolute',
            top: benefitsHiddenAreaHeight,
            bottom: benefitsHiddenAreaHeight,
            right: 0,
            width: theme.spacing(2), // container paddingRight
            background: `linear-gradient(to right, ${fade(
                theme.atlas.palette.background.deepCold,
                0.75
            )}, ${theme.atlas.palette.background.deepCold})`,
        },
    }),
    { name: 'TripBenefits' }
);

type TripBenefitsProps = {
    ride: SearchDto | RideDto;
    benefits: Array<SearchDtoBenefitsEnum | RideDtoBenefitsEnum>;
    className?: string;
};

export const TripBenefits: FC<TripBenefitsProps> = props => {
    const { ride, benefits, className } = props;
    const classes = useStyles();

    const executorName = getExecutorName(ride);

    return (
        <div className={clsx(classes.root, className)}>
            <div className={classes.container}>
                <div className={classes.benefits}>
                    {benefits.map(benefit => {
                        const IconComponent = benefitsIconsMap[benefit];

                        return IconComponent ? (
                            <IconComponent
                                className={classes.benefitIcon}
                                key={benefit}
                            />
                        ) : null;
                    })}
                </div>

                <div className={classes.executorName}>{executorName}</div>
                <div className={classes.fadeOverflow} />
            </div>
        </div>
    );
};
