import React, { FC } from 'react';
import clsx from 'clsx';
import { makeStyles, Theme } from '@material-ui/core/styles';

import { Typo } from '../Typo/Typo';
import { formatPhone, tel } from 'utils/phone';
import { useTranslation } from 'i18n';
import { AtlasTheme } from 'typings/atlas-theme';

const useStyles = makeStyles(
    (theme: Theme & AtlasTheme) => ({
        /* Styles applied to the root element. */
        root: {
            textAlign: 'left',
        },
        heading: {
            color: '#FFF',
            marginBottom: theme.spacing(1),
            lineHeight: '100%',
            [theme.breakpoints.down('lg')]: {
                fontSize: '12px',
            },
            [theme.breakpoints.down('sm')]: {
                fontSize: '16px',
            },
            [theme.breakpoints.up('lg')]: {
                fontSize: '16px',
            },
        },
        phones: {
            display: 'flex',
            flexWrap: 'wrap',
            flexDirection: 'column',
            marginTop: '10px',
        },
        phone: {
            color: '#FFF',
            cursor: 'pointer',
            fontSize: '14px',
            lineHeight: 1.5,
            fontWeight: 400,
            textDecoration: 'none',
            marginLeft: '10px',
            [theme.breakpoints.down('lg')]: {
                fontSize: '12px',
            },
            [theme.breakpoints.down('sm')]: {
                fontSize: '14px',
            },
            [theme.breakpoints.up('lg')]: {
                fontSize: '14px',
            },

            '&:hover': {
                textDecoration: 'underline',
            },
        },
        phoneItem: {
            display: 'flex',
            alignItems: 'center',
        },
        icon: {
            height: '13px',
            width: '13px',
        },
    }),
    { name: 'DesktopPhones' }
);

type Props = {
    className?: string;
    phones: string[];
};

export const PhonesList: FC<Props> = props => {
    const { className, phones } = props;
    const classes = useStyles();
    const { t } = useTranslation();

    return (
        <div className={clsx(classes.root, className)}>
            <Typo variant="title" weight="bold" className={classes.heading}>
                {t('phonesHeaderTitle')}
            </Typo>

            <div
                className={classes.phones}
                itemScope
                itemType="http://schema.org/ContactPoint"
            >
                {phones.map((phone, i) => {
                    const formattedPhone = formatPhone(phone);

                    return (
                        <div className={classes.phoneItem} key={i}>
                            <img
                                src="/static/img/callicon.svg"
                                alt="callicon"
                                className={classes.icon}
                            />
                            <a
                                key={phone}
                                href={`tel:${tel(formattedPhone)}`}
                                className={classes.phone}
                                itemProp="telephone"
                            >
                                {formattedPhone}
                            </a>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};
