import React, { FC } from 'react';
import AppsIcon from '@material-ui/icons/Apps';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import { useSelector } from 'react-redux';

import { Button } from '../ui/Button';
import { RootState } from 'store';
import { UserState } from 'store/user/types';
import { capitalize } from 'utils/capitalize';
import { usePlatform } from 'hooks/usePlatform';
import { useTranslation } from 'i18n';

const carbusLink = 'https://carbus.io/login';

export const CarbusLink: FC = () => {
    const { t } = useTranslation();
    const { isMobile, isCordova } = usePlatform();
    const { role, employee } = useSelector<RootState, UserState>(
        rootState => rootState.user
    );

    const buttonText = t(`carbus${capitalize(role)}`);

    if (!employee) return null;

    if (isMobile || isCordova) {
        return (
            <ListItem button component="a" href={carbusLink}>
                <ListItemIcon>
                    <AppsIcon />
                </ListItemIcon>
                <ListItemText primary={buttonText} />
            </ListItem>
        );
    } else {
        return (
            <Button href={carbusLink} startIcon={<AppsIcon />}>
                {buttonText}
            </Button>
        );
    }
};
