import React, { FC, useState } from 'react';
import Grid from '@material-ui/core/Grid';
import InfoIcon from '@material-ui/icons/Info';
import clsx from 'clsx';
import truncate from 'lodash/truncate';
import { makeStyles, Theme } from '@material-ui/core/styles';

import { Button } from 'components/ui/Button';
import { usePlatform } from 'hooks/usePlatform';
import { useTranslation } from 'i18n';
import { AtlasTheme } from 'typings/atlas-theme';

const useStyles = makeStyles(
    (theme: Theme & AtlasTheme) => ({
        /* Styles applied to the root element. */
        root: {
            backgroundColor: theme.palette.common.white,
            borderRadius: theme.shape.borderRadius,
            boxShadow: theme.atlas.shadows.bottom,
            padding: theme.spacing(2),
        },
        /* Styles applied to the container `div` element. */
        container: {
            display: 'flex',
            alignItems: 'center',
        },
        /* Styles applied to the `InfoIcon` component. */
        InfoIcon: {
            // margin: theme.spacing(2),
        },
        /* Styles applied to the text `div` element. */
        text: {
            lineHeight: 1.5,
        },
        /* Styles applied to the expand `Button` component. */
        expandButton: {
            padding: theme.spacing(0, 1),

            fontWeight: 700,
            cursor: 'pointer',
            '-webkit-tap-highlight-color': 'transparent',

            fontSize: theme.atlas.typography.body1.fontSize,
            textTransform: 'none',
            lineHeight: 'inherit',
            minHeight: 'unset',

            color: theme.atlas.palette.text.minor,

            '&:hover': {
                backgroundColor: 'unset',
            },
        },
    }),
    { name: 'ConnectingInfoCard' }
);

type ConnectingInfoCardProps = {
    className?: string;
    text: string;
};

export const ConnectingInfoCard: FC<ConnectingInfoCardProps> = props => {
    const { className, text } = props;
    const classes = useStyles();
    const { t } = useTranslation();
    const { isMobile, isCordova } = usePlatform();
    const [expanded, toggleExpand] = useState(false);

    if (isMobile || isCordova) {
        return (
            <div className={clsx(classes.root, className)}>
                <Grid
                    container
                    spacing={1}
                    justify="space-around"
                    className={classes.container}
                >
                    <Grid item md="auto">
                        <InfoIcon
                            className={classes.InfoIcon}
                            color="primary"
                        />
                    </Grid>

                    <Grid item xs={10}>
                        <div className={classes.text}>
                            {expanded && isMobile ? (
                                <span>{text}</span>
                            ) : (
                                <span>
                                    {truncate(text, {
                                        length: 150,
                                    })}
                                </span>
                            )}

                            <Button
                                onClick={() => toggleExpand(!expanded)}
                                className={classes.expandButton}
                                variant="text"
                                disableRipple
                            >
                                {expanded ? t('collapse') : t('expand')}
                            </Button>
                        </div>
                    </Grid>
                </Grid>
            </div>
        );
    }

    return (
        <div className={clsx(classes.root, className)}>
            <Grid
                container
                spacing={1}
                justify="space-around"
                className={classes.container}
            >
                <Grid item md="auto">
                    <InfoIcon className={classes.InfoIcon} color="primary" />
                </Grid>

                <Grid item md={11}>
                    <div className={classes.text}>
                        <span>{text}</span>
                    </div>
                </Grid>
            </Grid>
        </div>
    );
};
