import React from 'react';
import { storiesOf } from '@storybook/react';
import { ThemeProvider } from '@material-ui/core/styles';

import theme from 'themes/default';
import { Banner, BannerTitle, BannerText } from './Banner';

storiesOf('Banner', module)
    .addDecorator(fn => <ThemeProvider theme={theme}>{fn()}</ThemeProvider>)
    .add('basic', () => (
        <Banner>
            <BannerTitle>Экономия за счет технологий</BannerTitle>
            <BannerText>
                Технологии, в основе Атласа, увеличивают эффективность работы
                наших партнёров. Поэтому мы можем делать цены ниже.
            </BannerText>
        </Banner>
    ));
