import React, { useEffect, useState } from 'react';
import { storiesOf } from '@storybook/react';
import MoreVertIcon from '@material-ui/icons/MoreVert';

import { MobileAppBar } from './MobileAppBar';
import MobileAppBarProvider from './MobileAppBarProvider';
import useMobileAppBar from './useMobileAppBar';

storiesOf('MobileAppBar', module)
    .addDecorator(fn => <MobileAppBarProvider>{fn()}</MobileAppBarProvider>)
    .add('title', () => {
        const Component = () => {
            const [, dispatch] = useMobileAppBar();

            useEffect(() => {
                dispatch({
                    type: 'replace',
                    payload: {
                        title: 'Выберите место посадки',
                    },
                });
            }, []);

            return <MobileAppBar />;
        };

        return <Component />;
    })
    .add('subtitle', () => {
        const Component = () => {
            const [, dispatch] = useMobileAppBar();

            useEffect(() => {
                dispatch({
                    type: 'replace',
                    payload: {
                        title: 'Москва – Санкт-Петербург',
                        subtitle: '15 мая, Ср',
                    },
                });
            }, []);

            return <MobileAppBar />;
        };

        return <Component />;
    })
    .add('no back icon', () => {
        const Component = () => {
            const [, dispatch] = useMobileAppBar();

            useEffect(() => {
                dispatch({
                    type: 'replace',
                    payload: {
                        title: 'Москва – Санкт-Петербург',
                        subtitle: '15 мая, Ср',
                        disableBackIcon: true,
                    },
                });
            }, []);

            return <MobileAppBar />;
        };

        return <Component />;
    })
    .add('end icon', () => {
        const Component = () => {
            const [, dispatch] = useMobileAppBar();
            const [count, setCount] = useState(0);

            useEffect(() => {
                dispatch({
                    type: 'replace',
                    payload: {
                        title: 'Москва – Санкт-Петербург',
                        subtitle: '15 мая, Ср · 3 человека',
                        actionIcon: MoreVertIcon,
                        onClickAction: () => setCount(count => count + 1),
                    },
                });
            }, []);

            return (
                <>
                    <MobileAppBar />
                    <div style={{ marginTop: 16 }}>Clicked {count} times</div>
                </>
            );
        };

        return <Component />;
    });
