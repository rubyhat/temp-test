import React, { FC, ImgHTMLAttributes } from 'react';
import { makeStyles, Theme } from '@material-ui/core/styles';

import { Typo } from 'components/Typo/Typo';

const useStyles = makeStyles(
    (theme: Theme) => ({
        root: {
            // background: '#F8EFEB',
            // color: 'rgba(2, 10, 13, 0.9)',
            // boxSizing: 'border-box',
            minHeight: 177,
            padding: theme.spacing(3),
        },
        title: {
            marginBottom: theme.spacing(2),
        },
        titleText: {
            fontSize: 20,
        },
        img: {
            width: 60,
            height: 60,
            marginBottom: theme.spacing(2),
        },
    }),
    { name: 'Banner' }
);

export const Banner: FC<{ children: React.ReactNode }> = ({ children }) => {
    const classes = useStyles();

    return <div className={classes.root}>{children}</div>;
};

export const BannerTitle: FC<{ children: React.ReactNode }> = ({
    children,
}) => {
    const classes = useStyles();

    return (
        <div className={classes.title}>
            <Typo weight="bold" variant="title" className={classes.titleText}>
                {children}
            </Typo>
        </div>
    );
};

export const BannerIcon: FC<{
    src: React.ImgHTMLAttributes<HTMLImageElement>['src'];
}> = ({ src }) => {
    const classes = useStyles();

    return <img className={classes.img} src={src} alt="" />;
};

export const BannerText: FC<{ children: React.ReactNode }> = ({ children }) => {
    return (
        <div>
            <Typo variant="body1">{children}</Typo>
        </div>
    );
};
