import React, { useState } from 'react';
import { storiesOf } from '@storybook/react';

import { DesktopExpansionPanel } from './DesktopExpansionPanel';
import { Typo } from '../Typo/Typo';

storiesOf('DesktopExpansionPanel', module).add('default', () => {
    const Component = () => {
        const [expanded, setExpanded] = useState<string | false>('filters');
        const handlePanelChange = (panel: string) => (
            event: React.ChangeEvent<{}>,
            newExpanded: boolean
        ) => {
            setExpanded(newExpanded ? panel : false);
        };

        return (
            <div>
                <DesktopExpansionPanel
                    expanded={expanded === 'panel1'}
                    onChange={handlePanelChange('panel1')}
                    summary={<Typo>Panel1</Typo>}
                >
                    Технологии, в основе Атласа, увеличивают эффективность
                    работы наших партнёров. Поэтому мы можем делать цены ниже.
                </DesktopExpansionPanel>

                <DesktopExpansionPanel
                    expanded={expanded === 'panel2'}
                    onChange={handlePanelChange('panel2')}
                    summary={<Typo>Panel2</Typo>}
                >
                    Мы контролируем автомобили, водителей и сервис. Награждаем
                    за соблюдение и наказываем за нарушения.
                </DesktopExpansionPanel>
            </div>
        );
    };

    return <Component />;
});
