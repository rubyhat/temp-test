import React, { ChangeEvent, FC, useRef, useState } from 'react';
import AddIcon from '@material-ui/icons/Add';
import FormControl, { FormControlProps } from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import ListItemText from '@material-ui/core/ListItemText';
import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';
import { MenuProps } from '@material-ui/core/Menu';
import { makeStyles, Theme } from '@material-ui/core/styles';

import { PersonalDataDto } from 'swagger/client';
import {
    formatPassengerDataByDocument,
    formatPassengerNameByDocument,
} from 'utils/passenger';
import { useTranslation } from 'i18n';
import { AtlasTheme } from 'typings/atlas-theme';

const useStyles = makeStyles(
    (theme: Theme & AtlasTheme) => ({
        /* Styles applied to the root element. */
        root: {},
        /* Styles applied to the `Paper` component. */
        paper: {
            boxShadow: theme.atlas.shadows.fly,
        },
        /* Styles applied to the `FormControl` component. */
        formControl: {
            minWidth: 250,
        },
        newPassenger: {
            color: theme.atlas.palette.text.link,
            paddingTop: theme.spacing(2),
            paddingBottom: theme.spacing(2),
        },
        addIcon: {
            marginRight: theme.spacing(1),
        },
    }),
    { name: 'DocumentSelect' }
);

type Props = {
    value?: number;
    onChange?: (index: number) => void;
    onNewPassenger?: () => void;
    documents: PersonalDataDto[];
} & Pick<FormControlProps, 'fullWidth'>;

export const DocumentSelect: FC<Props> = props => {
    const {
        value: valueProp,
        onChange = () => {},
        documents,
        onNewPassenger,
        ...formControlProps
    } = props;
    const classes = useStyles();
    const { t } = useTranslation();
    const { current: menuProps } = useRef<Partial<MenuProps>>({
        anchorOrigin: {
            vertical: 'bottom',
            horizontal: 'left',
        },
        transformOrigin: {
            vertical: 'top',
            horizontal: 'left',
        },
        getContentAnchorEl: null,
        PaperProps: {
            className: classes.paper,
        },
    });

    const { current: isControlled } = useRef(valueProp != null);
    const [valueState, setValue] = useState<number | string>('');
    const value = isControlled ? valueProp : valueState;

    const handleNewPassenger = () => {
        if (onNewPassenger) onNewPassenger();
    };

    const handleChange = (
        e: ChangeEvent<{ name?: string; value: unknown }>
    ) => {
        if (e.target.value === 'newPassenger') {
            handleNewPassenger();
            return;
        }
        if (typeof e.target.value !== 'number') return;

        if (!isControlled) {
            setValue(e.target.value);
        }

        onChange(e.target.value);
    };

    return (
        <div className={classes.root}>
            <FormControl
                variant="outlined"
                className={classes.formControl}
                {...formControlProps}
            >
                {value === '' ? (
                    <InputLabel shrink={false}>
                        {t('booking:anotherPassengers')}
                    </InputLabel>
                ) : null}

                <Select
                    value={value}
                    onChange={handleChange}
                    MenuProps={menuProps}
                    placeholder={t('booking:anotherPassengers')}
                >
                    <MenuItem
                        className={classes.newPassenger}
                        value="newPassenger"
                    >
                        <AddIcon className={classes.addIcon} />
                        {t('booking:addNewPassenger')}
                    </MenuItem>
                    {documents.map((document, i) => (
                        <MenuItem value={i} key={i}>
                            {value === i ? (
                                formatPassengerNameByDocument(document)
                            ) : (
                                <ListItemText
                                    primary={formatPassengerNameByDocument(
                                        document
                                    )}
                                    secondary={formatPassengerDataByDocument(
                                        t,
                                        document
                                    )}
                                />
                            )}
                        </MenuItem>
                    ))}
                </Select>
            </FormControl>
        </div>
    );
};
