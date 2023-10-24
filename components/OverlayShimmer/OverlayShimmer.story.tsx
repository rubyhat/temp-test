import React from 'react';
import { storiesOf } from '@storybook/react';

import { OverlayShimmer } from './OverlayShimmer';

storiesOf('OverlayShimmer', module)
    .add('default', () => <OverlayShimmer text="Открытие рейса" open={true} />);
