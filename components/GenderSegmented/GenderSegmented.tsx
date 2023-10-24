import React, { FC } from 'react';
import { makeStyles, Theme } from '@material-ui/core/styles';
import clsx from 'clsx';

import { Button } from '../ui/Button';
import { ButtonGroup } from '../ui/ButtonGroup';
import { GenderTypesDto } from 'swagger/client';
import { useTranslation } from 'i18n';
import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';

const useStyles = makeStyles(
    (theme: Theme) => ({
        /* Styles applied to the root element. */
        root: {},
        select: {
            height: '100%',
        },
    }),
    { name: 'GenderSegmented' }
);

type Props = {
    className?: string;
    value: string;
    onChange: (genderCode: string) => void;
    genderTypes: GenderTypesDto[];
    variant?: 'buttongroup' | 'select';
};

export const GenderSegmented: FC<Props> = props => {
    const {
        genderTypes,
        className,
        value,
        onChange,
        variant = 'buttongroup',
    } = props;
    const classes = useStyles();
    const { t } = useTranslation();

    const handleChange = (
        e: React.MouseEvent<HTMLButtonElement, MouseEvent>
    ) => {
        if (e.currentTarget.dataset.value)
            onChange(e.currentTarget.dataset.value);
    };
    const getButtonVariant = (genderCode: string) =>
        value === genderCode ? 'contained' : 'outlined';
    const getGenderName = (genderCode: GenderTypesDto['code']) => {
        return t(`booking:gender${genderCode}`);
    };
    switch (variant) {
        case 'select':
            return (
                <div className={clsx(classes.root, className)}>
                    <Select
                        variant="standard"
                        fullWidth
                        value={value}
                        label="Hia"
                        className={classes.select}
                        onChange={({ target: { value } }) =>
                            onChange(value as any)
                        }
                    >
                        {genderTypes.map(genderType => (
                            <MenuItem
                                value={genderType.code}
                                key={genderType.code}
                            >
                                {getGenderName(genderType.code)}
                            </MenuItem>
                        ))}
                    </Select>
                </div>
            );
        default:
            return (
                <div className={clsx(classes.root, className)}>
                    <ButtonGroup
                        variant="outlined"
                        color="primary"
                        fullWidth
                        size="large"
                    >
                        {genderTypes.map(genderType => (
                            <Button
                                key={genderType.code}
                                onClick={handleChange}
                                name="genderCode"
                                data-value={genderType.code}
                                height="100%"
                                variant={getButtonVariant(genderType.code)}
                            >
                                {getGenderName(genderType.code)}
                            </Button>
                        ))}
                    </ButtonGroup>
                </div>
            );
    }
};
