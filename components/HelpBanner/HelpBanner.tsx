import React from 'react';
import { Paper, Typography } from '@material-ui/core';
import { makeStyles, Theme } from '@material-ui/core/styles';
import { RootState } from 'store';
import { WidgetState } from 'store/feedbackWidget/types';
import { useDispatch, useSelector } from 'react-redux';
import { CustomWindow } from 'typings/window';
import { AtlasTheme } from 'typings/atlas-theme';
import { FeedbackForm } from 'components/FeedbackForm';
import { isOpenFormModal } from 'store/feedbackWidget/actions';
import { useTranslation } from 'i18n';
import { BrandState } from 'store/brand/types';

const useStyles = makeStyles(
    (theme: Theme & AtlasTheme) => ({
        root: {
            display: 'flex',
            alignItems: 'center',
            backgroundColor: '#FFF',
            borderRadius: 8,
            marginTop: 16,
            padding: 16,
            boxShadow:
                '0px 0px 2px rgba(8, 78, 104, 0.18), 0px 2px 4px rgba(8, 78, 104, 0.12);',
            cursor: 'pointer',
        },
        image: {
            marginRight: 8,
        },
        title: {
            fontweight: 500,
            fontSize: 18,
            lineHeight: '22px',
            color: theme.palette.text.primary,
        },
        subtitle: {
            fontWeight: 500,
            fontSize: 14,
            lineHeight: '18px',
            color: theme.atlas.palette.text.trinity,
        },
    }),
    { name: 'HelpBanner' }
);

declare let window: CustomWindow;

export const HelpBanner = () => {
    const { t } = useTranslation();
    const classes = useStyles();
    const dispatch = useDispatch();
    const { brandName } = useSelector<RootState, BrandState>(
        rootState => rootState.brand
    );

    const handleBannerClick = () => dispatch(isOpenFormModal(true));

    return (
        <>
            <Paper
                onClick={handleBannerClick}
                elevation={0}
                className={classes.root}
            >
                <img
                    className={classes.image}
                    src="/static/img/HelpBannerIcon.svg"
                    alt="help-banner"
                />
                <Paper elevation={0}>
                    <Typography
                        className={classes.title}
                        variant="subtitle2"
                        component="h6"
                    >
                        {t('zammadMessageTitle', { context: brandName })}
                    </Typography>
                    <Typography
                        className={classes.subtitle}
                        variant="subtitle2"
                        component="p"
                    >
                        {t('zammadMessageSubtitle')}
                    </Typography>
                </Paper>
            </Paper>
            <FeedbackForm />
        </>
    );
};
