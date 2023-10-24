import React, { useRef, useState } from 'react';
import { storiesOf } from '@storybook/react';
import { makeStyles } from '@material-ui/core/styles';

import { MapEndpointPicker } from './MapEndpointPicker';
import { StopsDto } from 'swagger/client';

const useStyles = makeStyles(
    {
        /* Styles applied to the root element. */
        root: {
            width: '100%',
            height: '500px',
        },
    },
    { name: 'MapEndpointPicker-story' }
);

storiesOf('MapEndpointPicker', module).add('default', () => {
    const Component = () => {
        const containerRef = useRef(null);
        const [value, setValue] = useState<string | null>(null);
        const classes = useStyles();

        const handleChange = (id: StopsDto['id'] | null) => setValue(id);

        return (
            <div className={classes.root} ref={containerRef}>
                <MapEndpointPicker
                    value={value}
                    onChange={handleChange}
                    containerEl={containerRef}
                    endpoints={endpoints}
                    defaultLatitude={53.900559}
                    defaultLongitude={27.558895}
                />
            </div>
        );
    };

    return <Component />;
});

export const endpoints: StopsDto[] = [
    {
        id: 'c1',
        desc: 'Автоцентр',
        latitude: 53.894964,
        longitude: 27.53114,
        datetime: '2019-12-23T18:10:00',
        timezone: 'Europe/Moscow',
        important: false,
        dynamic: false,
    },
    {
        id: 'c2',
        desc: 'Белыничи',
        latitude: 53.911138,
        longitude: 27.526555,
        datetime: '2019-12-23T18:11:00',
        timezone: 'Europe/Moscow',
        important: false,
        dynamic: false,
    },
    {
        id: 'c3',
        desc: 'БРУ',
        latitude: 53.916878,
        longitude: 27.563906,
        datetime: '2019-12-23T18:12:00',
        timezone: 'Europe/Moscow',
        important: false,
        dynamic: false,
    },
    {
        id: 'c4',
        desc: 'Восход',
        latitude: 53.910514,
        longitude: 27.577677,
        datetime: '2019-12-23T18:13:00',
        timezone: 'Europe/Moscow',
        important: false,
        dynamic: false,
    },
    {
        id: 'c5',
        desc: 'г-ца Могилев',
        latitude: 53.904677,
        longitude: 27.584672,
        datetime: '2019-12-23T18:14:00',
        timezone: 'Europe/Moscow',
        important: false,
        dynamic: false,
    },
];
