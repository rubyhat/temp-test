import React, { FC } from 'react';
import Divider from '@material-ui/core/Divider';
import ListItem from '@material-ui/core/ListItem';
import clsx from 'clsx';
import { makeStyles, Theme } from '@material-ui/core/styles';

import { List } from 'components/ui/List/List';
import { AtlasTheme } from 'typings/atlas-theme';

const useStyles = makeStyles(
    (theme: Theme & AtlasTheme) => ({
        /* Styles applied to the root element. */
        root: {
            backgroundColor: '#FFF',
            borderRadius: theme.spacing(1),
            boxShadow: theme.atlas.shadows.bottom,
            padding: theme.spacing(0.5, 2),
            marginBottom: theme.spacing(2),
        },
        /* Styles applied to the step `ListItem` component. */
        step: {
            padding: '12px 0',
            cursor: 'pointer',
        },
        /* Pseudo-class applied to the completed step. */
        stepCompleted: {
            color: theme.palette.primary.main,
        },
        /* Pseudo-class applied to the active step. */
        stepActive: {
            color: theme.atlas.palette.text.base,
            fontWeight: 'bold',
        },
        /* Pseudo-class applied to the disabled step. */
        stepDisabled: {
            cursor: 'unset',
        },
        divider: {
            backgroundColor: '#E2E2E2',
        },
    }),
    { name: 'DesktopStepper' }
);

type Props = {
    activeStep: number;
    completed: { [k: number]: boolean };
    disabled: { [k: number]: boolean };
    onChange: (index: number) => void;
    steps: string[];
    className?: string;
};

export const DesktopStepper: FC<Props> = props => {
    const {
        activeStep,
        steps,
        onChange,
        completed,
        disabled,
        className,
    } = props;
    const classes = useStyles();

    const handleStep = (index: number) => () => {
        if (!disabled[index]) onChange(index);
    };

    return (
        <div className={clsx(classes.root, className)}>
            <List disablePadding>
                {steps.map((step, index) => (
                    <React.Fragment key={index}>
                        <ListItem
                            onClick={handleStep(index)}
                            className={clsx(classes.step, {
                                [classes.stepActive]: activeStep === index,
                                [classes.stepCompleted]: completed[index],
                                [classes.stepDisabled]: disabled[index],
                            })}
                            disabled={disabled[index]}
                            disableGutters
                        >
                            {`${index + 1}. ${step}`}
                        </ListItem>
                        {index < steps.length - 1 ? (
                            <Divider
                                className={classes.divider}
                                variant="fullWidth"
                            />
                        ) : null}
                    </React.Fragment>
                ))}
            </List>
        </div>
    );
};
