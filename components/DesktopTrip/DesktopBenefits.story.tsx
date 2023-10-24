import React, { useState } from 'react';
import { storiesOf } from '@storybook/react';

import { DesktopBenefits } from './DesktopBenefits';
import { SearchDtoBenefitsEnum } from 'swagger/client';
import { Button } from '../ui/Button';

storiesOf('DesktopBenefits', module).add('basic', () => {
    const Component = () => {
        const [open, setOpen] = useState(false);

        return (
            <>
                <DesktopBenefits open={open} benefits={benefits} />

                <Button
                    onClick={() => setOpen(!open)}
                    variant="contained"
                    color="primary"
                >
                    Open/Close
                </Button>
            </>
        );
    };

    return <Component />;
});

const benefits = [
    SearchDtoBenefitsEnum.Wifi,
    SearchDtoBenefitsEnum.Tv,
    SearchDtoBenefitsEnum.Air,
];
