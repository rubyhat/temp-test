import React, { FC, useLayoutEffect, useRef, useState } from 'react';
import BaseSelect, { SelectProps } from '@material-ui/core/Select';
import FormControl from '@material-ui/core/FormControl';
import Grid from '@material-ui/core/Grid';
import CheckIcon from '@material-ui/icons/Check';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';

import { useStyles } from './styles';

type Item = {
    text: string | number;
    value: string | number;
};

type Props = SelectProps & {
    id?: string;
    name?: string;
    label?: string;
    items: Item[];
};

export const Select: FC<Props> = React.memo(props => {
    const { id, name, label, items = [], variant, ...rest } = props;

    const classes = useStyles();
    const inputLabel = useRef<HTMLLabelElement>(null);
    const [labelWidth, setLabelWidth] = useState(0);

    useLayoutEffect(() => {
        if (label) {
            setLabelWidth(inputLabel.current!.offsetWidth);
        }
    });

    const checkIsSelected = (item: Item) => item.value === rest.value;

    const renderLabel = () => {
        return label ? (
            <InputLabel ref={inputLabel} htmlFor={id}>
                {label}
            </InputLabel>
        ) : null;
    };

    const renderItems = () => {
        return items.map(item => (
            <MenuItem
                value={item.value}
                key={item.value}
                className={classes.menuItem}
            >
                <Grid container justify="space-between" alignItems="center">
                    <div>{item.text}</div>
                    {checkIsSelected(item) ? (
                        <CheckIcon className={classes.icon} />
                    ) : null}
                </Grid>
            </MenuItem>
        ));
    };

    const renderValue = (value: unknown) => {
        const item = items.find(item => item.value === value);

        return item && item.text;
    };

    return (
        <FormControl className={classes.formControl} variant={variant}>
            {renderLabel()}
            <BaseSelect
                className={classes.select}
                inputProps={{
                    name,
                    id,
                }}
                MenuProps={{
                    className: classes.menu,
                    anchorOrigin: {
                        vertical: 'bottom',
                        horizontal: 'left',
                    },
                    transformOrigin: {
                        vertical: 'top',
                        horizontal: 'left',
                    },
                    getContentAnchorEl: null,
                }}
                labelWidth={labelWidth}
                renderValue={renderValue}
                {...rest}
            >
                {renderItems()}
            </BaseSelect>
        </FormControl>
    );
});
