import React, { FC } from 'react';
import Paper from '@material-ui/core/Paper';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import { makeStyles, Theme } from '@material-ui/core/styles';

import { AtlasPartnerContactsDto } from 'swagger/client';
import { DesktopPartnerItem } from './DesktopPartnerItem';
import { useTranslation } from 'i18n';

const useStyles = makeStyles(
    (theme: Theme) => ({
        /* Styles applied to the root element. */
        root: {},
        tableCell: {
            fontWeight: 700,
        },
    }),
    { name: 'PartnersTable' }
);

type Props = {
    partners: AtlasPartnerContactsDto[];
};

export const DesktopPartnersTable: FC<Props> = props => {
    const { partners } = props;
    const classes = useStyles();
    const { t } = useTranslation();

    return (
        <TableContainer component={Paper}>
            <Table aria-label="customized table">
                <TableHead>
                    <TableRow>
                        <TableCell />
                        <TableCell align="right" className={classes.tableCell}>
                            {t('partnersLegalAddress')}
                        </TableCell>
                        <TableCell align="right" className={classes.tableCell}>
                            {t('partnersUNP')}
                        </TableCell>
                        <TableCell align="right" className={classes.tableCell}>
                            {t('partnersWorkingHours')}
                        </TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {partners.map(partner => (
                        <DesktopPartnerItem
                            key={partner.unp}
                            partner={partner}
                        />
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    );
};
