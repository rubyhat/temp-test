import React, { FC } from 'react';
import { makeStyles, Theme } from '@material-ui/core/styles';

import { AtlasPartnerContactsDto } from 'swagger/client';
import { MobilePartnerItem } from './MobilePartnerItem';

const useStyles = makeStyles(
    (theme: Theme) => ({
        /* Styles applied to the root element. */
        root: {},
        /* Styles applied to the `MobilePartnerItem` component. */
        mobilePartnerItem: {
            '& ~ &': {
                marginTop: theme.spacing(2),
            },
        },
    }),
    { name: 'PartnersTable' }
);

type Props = {
    partners: AtlasPartnerContactsDto[];
};

export const MobilePartnersTable: FC<Props> = props => {
    const { partners } = props;
    const classes = useStyles();

    return (
        <div className={classes.root}>
            {partners.map(partner => (
                <MobilePartnerItem
                    className={classes.mobilePartnerItem}
                    key={partner.unp}
                    partner={partner}
                />
            ))}
        </div>
    );
};
