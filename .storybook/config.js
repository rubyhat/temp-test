import { configure, addDecorator } from '@storybook/react';

import { withProvider } from 'utils/storybook/withProvider';

// automatically import all files ending in *.stories.js
const req = require.context('../components', true, /\.story\.tsx$/);
function loadStories() {
    req.keys().forEach(filename => req(filename));
}

configure(loadStories, module);
addDecorator(withProvider);
