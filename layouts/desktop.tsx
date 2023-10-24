import React, { FC, ReactNode } from 'react';
import Container from '@material-ui/core/Container';
import clsx from 'clsx';
import { makeStyles, Theme } from '@material-ui/core/styles';

import { DesktopAppBar } from 'components/DesktopAppBar';

const useStyles = makeStyles(
    (theme: Theme) => ({
        /* Styles applied to the root element. */
        root: {},
        /* Pseudo-class applied to the root component if `fullHeight={true}` */
        fullHeight: {
            display: 'flex',
            flexDirection: 'column',
            height: '100vh',
        },
        /* Styles applied to the `Container` component. */
        container: {
            marginTop: 80 + 40, // DesktopAppBar height + 16
        },
        /* Pseudo-class applied to the Container `component` if `fullHeight={true}` */
        containerFullHeight: {
            flex: 1,
            marginTop: 0,
        },
    }),
    { name: 'Desktop' }
);

type Props = {
    children: ReactNode;
    fullHeight?: boolean;
};

export const Desktop: FC<Props> = props => {
    const { children, fullHeight } = props;
    const classes = useStyles();

    return (
        <div
            className={clsx(classes.root, {
                [classes.fullHeight]: fullHeight,
            })}
        >
            <DesktopAppBar variant="fixed" />

            <Container
                className={clsx(classes.container, {
                    [classes.containerFullHeight]: fullHeight,
                })}
            >
                {children || false}
            </Container>
        </div>
    );
};
