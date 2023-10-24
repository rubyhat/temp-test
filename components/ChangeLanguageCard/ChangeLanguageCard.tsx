import React from 'react';
import { AtlasTheme } from 'typings/atlas-theme';
import { makeStyles, Theme } from '@material-ui/core/styles';
import Box from '@material-ui/core/Box';
import { Typography } from '@material-ui/core';
import { i18n, useTranslation } from 'i18n';
import { langListArray } from 'i18n/utils';
import { useRouter } from 'next/router';

const useStyles = makeStyles(
    (theme: Theme & AtlasTheme) => ({
        /* Styles applied to the root element. */
        root: {
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '19px 16px',
            borderRadius: theme.spacing(1),
            backgroundColor: theme.atlas.palette.background.white,
            boxShadow:
                '0px 1px 8px 1px rgba(0, 0, 0, 0.08), 0px 0px 16px 2px rgba(0, 0, 0, 0.04), 0px -1px 2px rgba(0, 0, 0, 0.04)',
            cursor: 'pointer',
        },
        languageListCard: {
            ...theme.atlas.appBar.marginTop(24), // AppBar height + 24,
        },
        selectedLanguageBox: {
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'flex-end',
        },
        languageText: {
            fontSize: 14,
            fontWeight: 700,
            color: '#1673D6',
            lineHeight: 'inherit',
            marginLeft: theme.spacing(1),
        },
    }),
    { name: 'ChangeLanguageCard' }
);

export const ChangeLanguageCard = () => {
    const { t } = useTranslation();
    const classes = useStyles();
    const currentLanguage = langListArray.find(
        lang => lang.value === i18n.language
    );
    const router = useRouter();
    return (
        <Box
            className={classes.root}
            onClick={() => router.push('/profile/language')}
        >
            <Typography variant="body1">{t('language')}</Typography>
            {currentLanguage && (
                <Box className={classes.selectedLanguageBox}>
                    {Boolean(currentLanguage.icon) && (
                        <img src={currentLanguage.icon} alt="flag" />
                    )}
                    <Typography className={classes.languageText}>
                        {t(currentLanguage.title)}
                    </Typography>
                    <img
                        src="/static/img/icons-lang/arrow-right.svg"
                        alt="arrow"
                    />
                </Box>
            )}
        </Box>
    );
};
