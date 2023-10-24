import React from 'react';
import { storiesOf } from '@storybook/react';

import { MapPoint } from './MapPoint';

storiesOf('MapPoint', module)
    .add('default', () => <MapPoint tooltip="ост. Васнецова" />);
