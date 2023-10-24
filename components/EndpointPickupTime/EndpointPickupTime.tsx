import React, { FC } from 'react';
import ListItem from '@material-ui/core/ListItem';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import ListItemText from '@material-ui/core/ListItemText';
import parseISO from 'date-fns/parseISO';

import { Typo } from '../Typo/Typo';
import { useTranslation } from 'i18n';
import { format } from 'utils/date';
import { StopsDto } from 'swagger/client';
import { useSAAS } from 'hooks/useSAAS';

type Props = {
    value: StopsDto['id'] | null;
    stops: StopsDto[];
    dropoff?: boolean;
};

export const EndpointPickupTime: FC<Props> = props => {
    const { value, stops, dropoff } = props;
    const { t } = useTranslation();
    const { isMioTaxi } = useSAAS();

    const stop = stops.find(stop => stop.id === value);

    return isMioTaxi && dropoff ? null : (
        <ListItem>
            <ListItemText
                primary={
                    <Typo color="textSecondary">
                        {t(`booking:${dropoff ? 'dropoffTime' : 'pickupTime'}`)}
                    </Typo>
                }
            />

            {stop ? (
                <ListItemSecondaryAction>
                    <ListItemText
                        primary={
                            <Typo color="textPrimary" weight="bold">
                                {format(parseISO(stop.datetime), 'HH:mm')}
                            </Typo>
                        }
                    />
                </ListItemSecondaryAction>
            ) : null}
        </ListItem>
    );
};
