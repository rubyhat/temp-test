import React, { FC, ReactElement } from 'react';
import Button from '@material-ui/core/Button';
import KeyboardArrowDownIcon from '@material-ui/icons/KeyboardArrowDown';
import KeyboardArrowRightIcon from '@material-ui/icons/KeyboardArrowRight';
import Collapse from '@material-ui/core/Collapse';

import { useStyles } from './styles';

export type Props = {
    opened: boolean;
    title: string;
    children?: ReactElement[] | ReactElement;
    onClick?: () => void;
};

export const ExpansionPanel: FC<Props> = props => {
    const { opened, title, children, onClick } = props;
    const classes = useStyles();

    return (
        <>
            <Button
                className={classes.activator}
                onClick={onClick}
                fullWidth
                color="primary"
            >
                {opened ? (
                    <KeyboardArrowDownIcon />
                ) : (
                    <KeyboardArrowRightIcon />
                )}
                <div className={classes.title}>{title}</div>
            </Button>

            <Collapse in={opened} className={classes.collapse}>
                {children}
            </Collapse>
        </>
    );
};
