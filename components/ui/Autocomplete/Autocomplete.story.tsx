import React, { useState } from 'react';
import Grid from '@material-ui/core/Grid';
import MyLocationIcon from '@material-ui/icons/MyLocation';
import Card from '@material-ui/core/Card';
import Typography from '@material-ui/core/Typography';
import { storiesOf } from '@storybook/react';

import { Autocomplete } from './Autocomplete';

type Option = {
    text: string;
    value: string | number;
    addition?: string;
};

const countries = [
    'Afghanistan',
    'Aland Islands',
    'Albania',
    'Algeria',
    'American Samoa',
    'Andorra',
    'Angola',
    'Anguilla',
    'Antarctica',
    'Antigua and Barbuda',
    'Argentina',
    'Armenia',
    'Aruba',
    'Australia',
    'Austria',
    'Azerbaijan',
    'Bahamas',
    'Bahrain',
    'Bangladesh',
    'Barbados',
    'Belarus',
    'Belgium',
    'Belize',
    'Benin',
    'Bermuda',
    'Bhutan',
    'Bolivia, Plurinational State of',
    'Bonaire, Sint Eustatius and Saba',
    'Bosnia and Herzegovina',
    'Botswana',
    'Bouvet Island',
    'Brazil',
    'British Indian Ocean Territory',
    'Brunei Darussalam',
];

const options: Option[] = countries.map((country, index) => ({
    text: country,
    value: index,
    addition: `Additional info for ${country}`,
}));

storiesOf('ui/Autocomplete', module)
    .add('default', () => {
        const Component = () => {
            const [value, setValue] = useState<Option | null>(null);
            const handleChange = (value: Option | null) => setValue(value);

            return (
                <Autocomplete
                    value={value}
                    onChange={handleChange}
                    options={options}
                    label="Countries"
                    showEmpty
                />
            );
        };

        return <Component />;
    })
    .add('naked inside Card', () => {
        const Component = () => {
            const [value, setValue] = useState<Option | null>(null);
            const handleChange = (value: Option | null) => setValue(value);

            return (
                <Card style={{ padding: '8px 16px', overflow: 'unset' }}>
                    <Autocomplete
                        value={value}
                        onChange={handleChange}
                        options={options}
                        placeholder="Countries"
                        disableUnderline
                    />
                </Card>
            );
        };

        return <Component />;
    })
    .add('multiline option', () => {
        const Component = () => {
            const [value, setValue] = useState<Option | null>(null);
            const handleChange = (value: Option | null) => setValue(value);

            return (
                <Autocomplete
                    value={value}
                    onChange={handleChange}
                    label="Откуда"
                    options={options}
                    renderOptionContent={(option: Option) => (
                        <Grid
                            container
                            justify="space-between"
                            alignItems="center"
                        >
                            <Grid>
                                <Typography style={{ fontWeight: 'bold' }}>
                                    {option.text}
                                </Typography>
                                <Typography>{option.addition}</Typography>
                            </Grid>
                            {option.value === 0 ? (
                                <Grid>
                                    <MyLocationIcon style={{ color: 'grey' }} />
                                </Grid>
                            ) : null}
                        </Grid>
                    )}
                />
            );
        };

        return <Component />;
    });
