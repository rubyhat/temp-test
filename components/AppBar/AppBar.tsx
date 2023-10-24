import React, { FC, ReactNode, useEffect, useState } from 'react';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import CloseIcon from '@material-ui/icons/Close';
import Box from '@material-ui/core/Box';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import { makeStyles, Theme } from '@material-ui/core/styles';
import clsx from 'clsx';

import { BaseBar, Props as BaseBarProps } from '../ui/BaseBar';
import { AppDrawer } from '../AppDrawer/AppDrawer';
import { Logo } from 'components/Logo';
import Head from 'next/head';
import { AtlasTheme } from 'typings/atlas-theme';
import { useSelector } from 'react-redux';
import { RootState } from 'store';
import { WidgetState } from 'store/feedbackWidget/types';
import { useSAAS } from 'hooks/useSAAS';
import OnlineChatMobile from '../icons/OnlineChatMobile';
import { toggleZammad } from 'utils/toggleZammad';

const useStyles = makeStyles(
    (theme: Theme & AtlasTheme) => ({
        /* Styles applied to the `Box` component. */
        box: {
            flexGrow: 1,
            overflow: 'hidden',
        },
        /* Styles applied to the `Box` component if `textCenter={true}`. */
        boxCenter: {
            textAlign: 'center',
            position: 'absolute',
            left: 0,
            right: 0,
            marginLeft: 64,
            marginRight: 64,
        },
        /* Styles applied to the title `div` element. */
        title: {
            ...theme.atlas.typography.body1,
            position: 'relative',
        },
        titleOverflowHidden: {
            whiteSpace: 'nowrap',
        },
        titleRightGradient: {
            position: 'absolute',
            width: 36,
            right: 0,
            top: 0,
            bottom: 0,
            background:
                'linear-gradient(270deg, #FFF 0%, rgba(255, 255, 255, 0.98) 32.92%, rgba(255, 255, 255, 0.97) 57.32%, rgba(255, 255, 255, 0) 100%)',
        },
        /* Styles applied to the subtitle `div` element. */
        subtitle: {
            ...theme.atlas.typography.caption,
            color: theme.atlas.palette.text.minor,
        },
        /* Styles applied to the `IconButton` component. */
        backIcon: {
            marginRight: theme.spacing(2),
            color: theme.palette.primary.main,
        },
        /* Styles applied to the `AppDrawer` component. */
        appDrawer: {
            // exclude item from flex calculations
            position: 'absolute',
        },
    }),
    { name: 'AppBar' }
);

export type Props = Omit<BaseBarProps, 'children'> & {
    disableBackIcon?: boolean;
    showBurger?: boolean;
    showLogo?: boolean;
    endIcon?: ReactNode;
    onBack?: () => void;
    subtitle?: ReactNode;
    textCenter?: boolean;
    title: ReactNode;
    headTitle?: string;
    startIcon?: 'back' | 'close';
    paddingTop?: boolean;
    backAutoHide?: boolean;
    titleOverflowHidden?: boolean;
};

export const AppBar: FC<Props> = props => {
    const {
        disableBackIcon = false,
        showBurger,
        showLogo,
        endIcon = null,
        onBack = () => {},
        backAutoHide = true,
        subtitle,
        textCenter = false,
        title,
        headTitle: headTitleProp,
        startIcon = 'back',
        titleOverflowHidden,
        ...rest
    } = props;
    const { isCompasBus } = useSAAS();
    const [open, setOpen] = useState(false);

    const { zammadChatIsLoad } = useSelector<RootState, WidgetState>(
        rootState => rootState.widget
    );

    let StartIcon = ArrowBackIcon;
    switch (startIcon) {
        case 'close':
            StartIcon = CloseIcon;
            break;
    }

    const classes = useStyles(props);
    useEffect(() => {
        if (process.browser && window.StatusBar) {
            if (window.cordova.platformId === 'ios') {
                window.StatusBar.styleDefault();
            }
        }
    }, []);

    const backUnavailable =
        backAutoHide &&
        process.browser &&
        window.history &&
        !window.history.length;

    const headTitle = headTitleProp
        ? headTitleProp
        : typeof title === 'string'
        ? title
        : undefined;

    return (
        <BaseBar {...rest}>
            {headTitle ? (
                <Head>
                    <title>{headTitle}</title>
                </Head>
            ) : null}
            {showBurger ? (
                <IconButton
                    onClick={() => setOpen(true)}
                    edge="start"
                    color="inherit"
                    aria-label="menu"
                >
                    <MenuIcon />
                </IconButton>
            ) : !disableBackIcon && !backUnavailable ? (
                <IconButton
                    edge="start"
                    className={classes.backIcon}
                    color="inherit"
                    aria-label="menu"
                    onClick={onBack}
                >
                    <StartIcon />
                </IconButton>
            ) : null}

            {showLogo && !title ? (
                <Logo dark mini />
            ) : (
                <Box
                    className={clsx(classes.box, {
                        [classes.boxCenter]: textCenter,
                    })}
                >
                    <div
                        className={clsx(classes.title, {
                            [classes.titleOverflowHidden]: titleOverflowHidden,
                        })}
                    >
                        {title}

                        {titleOverflowHidden ? (
                            <div className={classes.titleRightGradient} />
                        ) : null}
                    </div>
                    {subtitle && (
                        <div className={classes.subtitle}>{subtitle}</div>
                    )}
                </Box>
            )}
            {isCompasBus && zammadChatIsLoad && !title ? (
                <IconButton edge="end" color="primary" onClick={toggleZammad}>
                    <OnlineChatMobile />
                </IconButton>
            ) : (
                <div>{endIcon}</div>
            )}

            <AppDrawer
                className={classes.appDrawer}
                open={open && showBurger}
                onClose={() => setOpen(false)}
            />
        </BaseBar>
    );
};
