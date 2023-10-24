import React, { FC } from 'react';
import clsx from 'clsx';
import { makeStyles, Theme } from '@material-ui/core/styles';

import { KarmaInfo } from 'components/KarmaInfo';
import { AtlasTheme } from 'typings/atlas-theme';

const useStyles = makeStyles(
    (theme: Theme & AtlasTheme) => ({
        /* Styles applied to the root element. */
        root: {
            backgroundColor: '#FFF',
            boxShadow: theme.atlas.shadows.bottom,
            borderRadius: theme.shape.borderRadius,
        },
    }),
    { name: 'KarmaInfoCard' }
);

type Props = {
    className?: string;
};

export const KarmaInfoCard: FC<Props> = props => {
    const { className } = props;
    const classes = useStyles();

    return (
        <div className={clsx(classes.root, className)}>
            <KarmaInfo />
        </div>
    );
};
