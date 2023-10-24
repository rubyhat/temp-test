import React, { FC } from 'react';
import clsx from 'clsx';
import { makeStyles } from '@material-ui/core/styles';

import { Typo } from 'components/Typo/Typo';

const useStyles = makeStyles(
    theme => ({
        /* Styles applied to the root element. */
        root: {},
        /* Styles applied to the title `div` element. */
        title: {},
        /* Styles applied to the text `div` element. */
        text: {
            marginTop: theme.spacing(0.5),
        },
    }),
    { name: 'DownloadAppPaperBanner' }
);

type DownloadAppPaperBannerProps = {
    className?: string;
    title: string;
    text: string;
};

export const DownloadAppPaperBanner: FC<
    DownloadAppPaperBannerProps
> = props => {
    const { className, title, text } = props;
    const classes = useStyles();

    return (
        <div className={clsx(classes.root, className)}>
            <Typo className={classes.title} variant="subtitle" weight="bold">
                {title}
            </Typo>

            <Typo className={classes.text} color="textSecondary">
                {text}
            </Typo>
        </div>
    );
};
