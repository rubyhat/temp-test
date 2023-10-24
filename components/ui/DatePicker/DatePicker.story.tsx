import React, { useState } from 'react';
import { storiesOf } from '@storybook/react';
import DateFnsUtils from '@date-io/date-fns';
import ruLocale from 'date-fns/locale/ru';
import { MuiPickersUtilsProvider } from '@material-ui/pickers';
import Card from '@material-ui/core/Card';

import { DatePicker } from './DatePicker';

storiesOf('ui/DatePicker', module)
    .addDecorator(fn => (
        <MuiPickersUtilsProvider utils={DateFnsUtils} locale={ruLocale}>
            {fn()}
        </MuiPickersUtilsProvider>
    ))
    .add('Calendar', () => {
        const Component = () => {
            const [date, setDate] = useState(new Date());
            const handleChange = (date: any) => {
                setDate(date);
            };

            return (
                <Card style={{ display: 'inline-flex', paddingBottom: 16 }}>
                    <DatePicker value={date} onChange={handleChange} />
                </Card>
            );
        };

        return <Component />;
    })
    .add('DatePicker', () => {
        const Component = () => {
            const [date, setDate] = useState(new Date());
            const [open, setOpen] = useState(false);
            const handleChange = (date: any) => {
                setDate(date);
            };
            const handleOpen = () => setOpen(true);
            const handleClose = () => setOpen(false);

            return (
                <Card
                    style={{ display: 'inline-flex', padding: '16px 16px 4px' }}
                >
                    <DatePicker
                        open={open}
                        value={date}
                        onOpen={handleOpen}
                        onClose={handleClose}
                        onChange={handleChange}
                        onAccept={handleClose}
                        variant="inline"
                        label="Дата"
                        InputProps={{
                            disableUnderline: true,
                        }}
                    />
                </Card>
            );
        };

        return <Component />;
    });
