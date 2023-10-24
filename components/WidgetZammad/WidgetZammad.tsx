import React from 'react';

import { installZammadChat } from 'components/WidgetZammad/installZammadChat';
import { installJQuery } from 'components/WidgetZammad/installJQuery';

import { useDispatch } from 'react-redux';
import { useSAAS } from '../../hooks/useSAAS';

export const WidgetZammad = () => {
    const { isCompasBus } = useSAAS();
    const dispatch = useDispatch();
    const [jqisLoad, setjqIsLoad] = React.useState(false);
    React.useEffect(() => {
        if (isCompasBus) {
            const hasJq = document.getElementById('jquery-min-js');
            hasJq ? setjqIsLoad(true) : installJQuery(setjqIsLoad);
        }
    }, [isCompasBus, jqisLoad]);

    React.useEffect(() => {
        if (isCompasBus && jqisLoad) {
            installZammadChat(jqisLoad, dispatch, isCompasBus);
        }
    }, [jqisLoad, dispatch, isCompasBus]);

    return <></>;
};
