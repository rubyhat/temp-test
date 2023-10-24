import React, { FC } from 'react';
import { makeStyles, Theme } from '@material-ui/core/styles';
import Backdrop from '@material-ui/core/Backdrop';

import { Logo } from 'components/Logo';
import { Stub } from '../Stub/Stub';
import { AtlasTheme } from 'typings/atlas-theme';

const useStyles = makeStyles(
    (theme: Theme & AtlasTheme) => ({
        /* Styles applied to the Backdrop root element. */
        backdropRoot: {
            zIndex: theme.zIndex.modal,
            backgroundColor: theme.atlas.palette.background.deepCold,
            paddingLeft: theme.spacing(2),
            paddingRight: theme.spacing(2),
            display: 'block',
        },
        /* Styles applied to the logo `div` element. */
        logo: {
            ...theme.atlas.appBar.marginTop(4),
            textAlign: 'center',
        },
        /* Styles applied to the container `div` element. */
        container: {
            ...theme.atlas.appBar.paddingTop(0),
            position: 'absolute',
            top: 0,
            bottom: 0,
            left: 0,
            right: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-around',
        },
        /* Styles applied to the text `div` element. */
        text: {
            position: 'relative',
            textAlign: 'center',
            fontWeight: 700,
            fontSize: theme.atlas.typography.header.fontSize,
            color: theme.atlas.palette.text.minor,
        },
    }),
    { name: 'OverlayShimmer' }
);

type Props = {
    open: boolean;
    text: string;
};

export const OverlayShimmer: FC<Props> = props => {
    const { open, text } = props;
    const classes = useStyles();

    return (
        <Backdrop
            classes={{
                root: classes.backdropRoot,
            }}
            open={open}
        >
            <div className={classes.logo}>
                <Logo dark />
            </div>
            <div className={classes.container}>
                <div className={classes.text}>
                    {text}
                    <Stub absolute transparent />
                </div>
            </div>
        </Backdrop>
    );
};
