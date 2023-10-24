import React, { CSSProperties, FC, ReactNode } from 'react';
import Dialog, { DialogProps } from '@material-ui/core/Dialog';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import { fade, makeStyles, Theme, useTheme } from '@material-ui/core/styles';
import clsx from 'clsx';
import { AtlasTheme } from 'typings/atlas-theme';
const useStyles = makeStyles(
    (theme: Theme & AtlasTheme) => ({
        /* Styles applied to the `Paper` component. */
        paper: {
            height: 'unset',
        },
        /* Styles applied to the container element on small devices. */
        containerWidthSm: {
            alignItems: 'flex-end',
        },
        /* Styles applied to the container element on small devices if `position="center"`. */
        containerCenterWidthSm: {
            alignItems: 'center',
        },
        /* Styles applied to the `Backdrop` root component. */
        backdropRoot: {
            backgroundColor: fade(theme.atlas.palette.background.dark, 0.72),
        },
        /* Styles applied to the `Paper` root component. */
        paperRoot: {
            boxShadow: theme.atlas.shadows.fly,
        },
        /* Styles applied to the `Paper` root component on small devices. */
        paperRootWidthSm: {
            boxShadow: 'unset',
        },
        /* Styles applied to the `Dialog` root component if `fullWidth={true}`. */
        paperFullWidth: {
            margin: theme.spacing(2),
            width: 'calc(100% - 32px)', // margin x 2 = 32px
        },
        paddingBottom: {
            ...theme.atlas.bottomBar.paddingBottom(0),
        },
    }),
    { name: 'ResponsiveDialog' }
);

export type Props = DialogProps & {
    BarComponent?: ReactNode;
    height?: CSSProperties['height'];
    position?: 'end' | 'center';
    paddingBottom?: boolean;
};

export const ResponsiveDialog: FC<Props> = props => {
    const {
        children,
        onClose,
        BarComponent = null,
        height = 'auto',
        position = 'end',
        paddingBottom = false,
        ...rest
    } = props;

    const classes = useStyles();
    const theme = useTheme();
    const isSmall = useMediaQuery(theme.breakpoints.down('sm'));

    return (
        <Dialog
            disableScrollLock
            classes={{
                container: clsx({
                    [classes.containerWidthSm]: isSmall && position === 'end',
                    [classes.containerCenterWidthSm]:
                        isSmall && position === 'center',
                }),
                paper: clsx(classes.paper, {
                    [classes.paddingBottom]: paddingBottom,
                }),
                paperFullWidth: classes.paperFullWidth,
            }}
            fullScreen={isSmall}
            onClose={onClose}
            BackdropProps={{
                classes: {
                    root: classes.backdropRoot,
                },
            }}
            PaperProps={{
                classes: {
                    root: clsx(classes.paperRoot, {
                        [classes.paperRootWidthSm]: isSmall,
                    }),
                },
                style: {
                    height: isSmall ? height : undefined,
                },
            }}
            {...rest}
        >
            {BarComponent}
            {children}
        </Dialog>
    );
};
