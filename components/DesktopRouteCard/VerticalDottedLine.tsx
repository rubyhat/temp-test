import React, { FC } from 'react';
import clsx from 'clsx';
import { makeStyles, Theme } from '@material-ui/core/styles';
import { AtlasTheme } from 'typings/atlas-theme';

const useStyles = makeStyles(
    (theme: Theme & AtlasTheme) => ({
        /* Styles applied to the root element. */
        root: {},
        dot: {
            backgroundColor: theme.atlas.palette.background.blueGray80,
            width: 2,
            height: 2,
            borderRadius: '50%',

            '& ~ &': {
                marginTop: 2,
            },
        },
    }),
    { name: 'VerticalDottedLine' }
);

type VerticalDottedLineProps = {
    /** Number of dots **/
    dots: number;
    className?: string;
};

export const VerticalDottedLine: FC<VerticalDottedLineProps> = props => {
    const { className, dots } = props;
    const classes = useStyles();

    return (
        <div className={clsx(classes.root, className)}>
            {Array.from({ length: dots }).map((key, index) => (
                <div className={classes.dot} key={index} />
            ))}
        </div>
    );
};
