import React, { FC } from 'react';
import ListItem from '@material-ui/core/ListItem';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import ListItemText from '@material-ui/core/ListItemText';

import { Typo } from '../Typo/Typo';
import { formatPhone, tel } from 'utils/phone';
import { useTranslation } from 'i18n';

type Props = {
    phone: string;
};

export const CarrierPhonesListItem: FC<Props> = props => {
    const { phone } = props;
    const { t } = useTranslation();

    const formattedPhone = formatPhone(phone);

    return (
        <ListItem>
            <ListItemText
                primary={
                    <Typo color="textSecondary">{t('order:phonePartner')}</Typo>
                }
            />
            <ListItemSecondaryAction>
                <ListItemText
                    primary={
                        <Typo color="textPrimary">
                            <a href={`tel:${tel(formattedPhone)}`}>
                                {formattedPhone}
                            </a>
                        </Typo>
                    }
                />
            </ListItemSecondaryAction>
        </ListItem>
    );
};
