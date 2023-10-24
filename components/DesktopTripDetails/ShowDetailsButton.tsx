import React, { FC } from 'react';
import Button from '@material-ui/core/Button';
import ExpandLessIcon from '@material-ui/icons/ExpandLess';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import { makeStyles, Theme } from '@material-ui/core/styles';

import { useBetweenSmAndMdMediaQuery } from 'hooks/useBetweenSmAndMdMediaQuery';
import { useTranslation } from 'i18n';
import { AtlasTheme } from 'typings/atlas-theme';

const useStyles = makeStyles(
    (theme: Theme & AtlasTheme) => ({
        /* Styles applied to the root element. */
        root: {
            fontSize: theme.atlas.typography.body1.fontSize,
            fontWeight: theme.typography.fontWeightMedium,
            textTransform: 'unset',
            padding: 0,

            '&:hover': {
                backgroundColor: 'unset',
            },
        },
    }),
    { name: 'ShowDetailsButton' }
);

type ShowDetailsButtonProps = {
    onClick?: () => void;
    arrowDirection: 'up' | 'down';
};

export const ShowDetailsButton: FC<ShowDetailsButtonProps> = props => {
    const { onClick, arrowDirection } = props;
    const classes = useStyles();
    const { t } = useTranslation();

    const isBetweenSmAndMd = useBetweenSmAndMdMediaQuery();

    const arrowIcon =
        arrowDirection === 'up' ? (
            <ExpandLessIcon fontSize="large" />
        ) : (
            <ExpandMoreIcon fontSize="large" />
        );

    return (
        <Button
            className={classes.root}
            variant="text"
            color="primary"
            endIcon={arrowIcon}
            disableRipple
            onClick={onClick}
        >
            {isBetweenSmAndMd ? t('showDetailsBrief') : t('showDetails')}
        </Button>
    );
};
