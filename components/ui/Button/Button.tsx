import React, { CSSProperties, FC } from 'react';
import BaseButton, { ButtonProps } from '@material-ui/core/Button';
import clsx from 'clsx';

import { useStyles } from './styles';

export type Props = ButtonProps & {
    multiline?: boolean;
    title?: string;
    subtitle?: string;
    height?: CSSProperties['height'];
};

export const Button: FC<Props> = props => {
    const {
        multiline: multilineProp,
        children = null,
        title,
        subtitle: subtitleProp,
        height
    } = props;
    const { multiline, root, subtitle, ...classes } = useStyles();

    return (
        <BaseButton
            classes={{
                root: clsx(root, { [multiline]: multilineProp }),
                ...classes,
            }}
            style={{
                height: height,
                minHeight: height,
            }}
            {...props}
        >
            {title && subtitle ? (
                <div>
                    {title}
                    <div className={subtitle}>{subtitleProp}</div>
                </div>
            ) : (
                title || children
            )}
        </BaseButton>
    );
};
