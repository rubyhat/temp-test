import React from 'react';
import { MobileAppBarContext } from '../MobileAppBarProvider';

const useMobileAppBar = () => React.useContext(MobileAppBarContext);

export default useMobileAppBar;
