import React, { FC } from 'react';
import clsx from 'clsx';
import { makeStyles, Theme } from '@material-ui/core/styles';

import { Tooltip } from '../ui/Tooltip';
import { AtlasTheme } from 'typings/atlas-theme';

const useStyles = makeStyles(
    (theme: Theme & AtlasTheme) => ({
        /* Styles applied to the root element. */
        root: {},
        item: {
            display: 'flex',
        },
        title: {
            ...theme.atlas.typography.body5,
            textDecoration: 'underline',
            cursor: 'pointer',
            color: theme.palette.primary.main,
        },
        icon: {
            marginLeft: theme.spacing(1),
        },
        html: {
            fontSize: theme.atlas.typography.body4.fontSize,
            fontWeight: 400,

            '& ul': {
                margin: 0,
                paddingLeft: 0,
                listStyleType: 'disc',
                listStylePosition: 'inside',
            },
            '& li': {
                lineHeight: 1.5,
            },
        },
    }),
    { name: 'DesktopConditions' }
);

type Props = {
    className?: string;
    title: string;
    text: string;
};

export const DesktopConditions: FC<Props> = props => {
    const { className, text, title } = props;
    const classes = useStyles();

    return (
        <div className={clsx(classes.root, className)}>
            <Tooltip
                title={
                    <span
                        className={classes.html}
                        dangerouslySetInnerHTML={{ __html: text }}
                    />
                }
                variant="white"
            >
                <div className={classes.item}>
                    <div className={classes.title}>{title}</div>
                </div>
            </Tooltip>
        </div>
    );
};
