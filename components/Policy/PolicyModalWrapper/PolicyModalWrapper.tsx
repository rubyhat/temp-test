import React from 'react';
import { useSelector } from 'react-redux';

import { PolicyModal } from 'components/Policy/PolicyModal';
import { RootState } from 'store';
import { PolicyState } from 'store/saasPolicyInfo/types';
import { UserState } from 'store/user/types';

export const PolicyModalWrapper = () => {
    const policy = useSelector<RootState, PolicyState>(
        rootState => rootState.policy
    );
    const user = useSelector<RootState, UserState>(rootState => rootState.user);

    const isNeedAcceptPolicy =
        policy.version !== user.policyVersion &&
        user.phoneNumber !== '' &&
        policy.countryCodes.length > 0;
    const [isOpen, setIsOpen] = React.useState<boolean>(
        policy.isActive && isNeedAcceptPolicy
    );

    React.useEffect(() => {
        if (policy.isActive && isNeedAcceptPolicy) setIsOpen(true);
    }, [policy, user, isNeedAcceptPolicy]);

    return (
        <>
            {policy.isActive && isNeedAcceptPolicy && (
                <PolicyModal
                    open={isOpen}
                    data={{
                        title: policy.titleMain,
                        subtitle: policy.titleSecondery,
                        docUrl: policy.link,
                        version: policy.version,
                    }}
                    setIsOpen={setIsOpen}
                />
            )}
        </>
    );
};
