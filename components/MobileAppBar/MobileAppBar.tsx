import React, { FC } from 'react';
import { useRouter } from 'next/router';
import IconButton from '@material-ui/core/IconButton';

import useMobileAppBar from './useMobileAppBar';
import { AppBar } from '../AppBar';

export type Props = {
    textCenter?: boolean;
};

export const MobileAppBar: FC<Props> = props => {
    const { textCenter } = props;
    const router = useRouter();
    const [state] = useMobileAppBar();
    const handleBack = () => router.back();

    const IconComponent = state.actionIcon;

    return (
        <AppBar
            position="static"
            color="default"
            title={state.title}
            subtitle={state.subtitle}
            textCenter={textCenter}
            disableBackIcon={state.disableBackIcon}
            onBack={handleBack}
            endIcon={
                state.actionIcon && state.onClickAction ? (
                    <IconButton
                        edge="end"
                        color="primary"
                        onClick={state.onClickAction}
                    >
                        {IconComponent ? <IconComponent /> : null}
                    </IconButton>
                ) : null
            }
        />
    );
};
