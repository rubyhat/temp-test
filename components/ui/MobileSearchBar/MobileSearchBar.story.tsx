import React from 'react';
import { storiesOf } from '@storybook/react';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';

import { Button } from '../Button';
import { MobileSearchBar } from './MobileSearchBar';

storiesOf('ui/MobileSearchBar', module).add('default', () => {
    const Component = () => {
        const [open, setOpen] = React.useState(true);
        const [value, setValue] = React.useState('');

        const handleClickOpen = () => {
            setOpen(true);
        };
        const handleClose = () => {
            document.body.style.overflow = 'auto';
            setOpen(false);
        };
        const handleChange = (value: string) => setValue(value);

        const renderItem = (item: Item) => {
            return (
                <ListItem button>
                    <ListItemText
                        primary={item.title}
                        secondary={item.subtitle}
                    />
                </ListItem>
            );
        };

        return (
            <>
                <Button
                    variant="outlined"
                    color="primary"
                    onClick={handleClickOpen}
                >
                    Open MobileSearchBar
                </Button>

                <MobileSearchBar
                    value={value}
                    onChange={handleChange}
                    open={open}
                    onClose={handleClose}
                    items={items}
                    renderItem={renderItem}
                    placeholder="Пункт отправления"
                    cancelButtonLabel="Отмена"
                />
            </>
        );
    };

    return <Component />;
});

type Item = {
    title: string;
    subtitle: string;
};

const items: Item[] = [
    {
        title: 'Магадан',
        subtitle: 'Магаданская область, Россия',
    },
    {
        title: 'Москва',
        subtitle: 'Россия',
    },
    {
        title: 'Санкт-Петербург',
        subtitle: 'Россия',
    },
    {
        title: 'Ростов-на-Дону',
        subtitle: 'Ростовская область, Россия',
    },
    {
        title: 'Могилёв',
        subtitle: 'Беларусь',
    },
    {
        title: 'Ульяновск',
        subtitle: 'Ульяновская область, Россия',
    },
];
