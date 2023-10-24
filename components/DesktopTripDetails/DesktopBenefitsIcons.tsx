import React, { FC } from 'react';
import Tooltip from '@material-ui/core/Tooltip';
import camelCase from 'lodash/camelCase';
import clsx from 'clsx';
import upperFirst from 'lodash/upperFirst';
import { SvgIconProps } from '@material-ui/core/SvgIcon';
import { makeStyles, Theme } from '@material-ui/core/styles';

import { SearchDtoBenefitsEnum } from 'swagger/client';
import { benefitsIconsMap } from 'utils/benefits';
import { useTranslation } from 'i18n';

const useStyles = makeStyles(
    (theme: Theme) => ({
        /* Styles applied to the root element. */
        root: {},
        icons: {
            whiteSpace: 'nowrap',
            display: 'inline-flex',
        },
        icon: {
            '& ~ &': {
                marginLeft: theme.spacing(2),
            },
        },
    }),
    { name: 'DesktopBenefitsIcons' }
);

type Props = {
    benefits: SearchDtoBenefitsEnum[];
    maxItems?: number;
    className?: string;
    SvgIconProps?: SvgIconProps;
};

export const DesktopBenefitsIcons: FC<Props> = props => {
    const { benefits, className, maxItems = 5, SvgIconProps } = props;
    const classes = useStyles();
    const { t } = useTranslation();

    return (
        <div className={clsx(classes.root, className)}>
            <div className={classes.icons}>
                {benefits.slice(0, maxItems).map((item, i) => {
                    const IconComponent = benefitsIconsMap[item];

                    return IconComponent ? (
                        <Tooltip
                            key={i}
                            title={
                                t(
                                    `benefit${upperFirst(camelCase(item))}`,

                                    {
                                        defaultValue: 'N/A',
                                    }
                                ) || ''
                            }
                        >
                            <IconComponent
                                className={classes.icon}
                                key={item}
                                color="disabled"
                                {...SvgIconProps}
                            />
                        </Tooltip>
                    ) : null;
                })}
            </div>
        </div>
    );
};
