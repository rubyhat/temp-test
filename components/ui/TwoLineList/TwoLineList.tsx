import React, { FC } from 'react';
import Divider, { DividerProps } from '@material-ui/core/Divider';
import List, { ListProps } from '@material-ui/core/List';
import clsx from 'clsx';
import { makeStyles, Theme } from '@material-ui/core/styles';
import { AtlasTheme } from 'typings/atlas-theme';

const useStyles = makeStyles(
    (theme: Theme & AtlasTheme) => ({
        /* Styles applied to the root element. */
        root: {
            borderRadius: theme.atlas.borderRadius.medium,
            boxShadow: theme.atlas.shadows.bottom,
            backgroundColor: theme.palette.common.white,
        },
        /* Styles applied to the `Divider` component. */
        divider: {
            backgroundColor: theme.atlas.palette.divider.separator,
        },
    }),
    { name: 'TwoLineList' }
);

type TwoLineListProps = ListProps & {
    disableDivider?: boolean;
    DividerProps?: DividerProps;
};

export const TwoLineList: FC<TwoLineListProps> = props => {
    const {
        className,
        children,
        disableDivider,
        DividerProps,
        ...other
    } = props;
    const classes = useStyles();

    return (
        <List
            className={clsx(classes.root, className)}
            disablePadding
            {...other}
        >
            {React.Children.map(children, (child, index) => {
                if (!React.isValidElement(child)) {
                    return;
                }

                if (disableDivider) return child;

                const length = React.Children.count(children);
                if (index < length - 1) {
                    return (
                        <>
                            {child}
                            <Divider
                                className={classes.divider}
                                variant="middle"
                                {...DividerProps}
                            />
                        </>
                    );
                }

                return child;
            })}
        </List>
    );
};
