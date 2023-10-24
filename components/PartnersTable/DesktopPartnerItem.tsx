import React, { FC } from 'react';
import TableCell from '@material-ui/core/TableCell';
import TableRow from '@material-ui/core/TableRow';

import { AtlasPartnerContactsDto } from 'swagger/client';
import { Typo } from '../Typo/Typo';

type Props = {
    partner: AtlasPartnerContactsDto;
};

export const DesktopPartnerItem: FC<Props> = props => {
    const { partner } = props;

    return (
        <TableRow>
            <TableCell component="th" scope="row">
                <Typo dangerouslySetInnerHTML={{ __html: partner.name }} />
                <Typo
                    dangerouslySetInnerHTML={{ __html: partner.by }}
                    variant="caption"
                    color="textSecondary"
                />
                <Typo variant="caption">{partner.when}</Typo>
            </TableCell>
            <TableCell align="right">
                <Typo
                    dangerouslySetInnerHTML={{ __html: partner.address }}
                    variant="caption"
                />
            </TableCell>
            <TableCell align="right">
                <Typo>{partner.unp}</Typo>
            </TableCell>
            <TableCell align="right">
                <Typo>{partner.working}</Typo>
            </TableCell>
        </TableRow>
    );
};
