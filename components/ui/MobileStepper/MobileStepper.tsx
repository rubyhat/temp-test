import React, { FC, useEffect } from 'react';
import Step from '@material-ui/core/Step';
import StepButton from '@material-ui/core/StepButton';
import Stepper from '@material-ui/core/Stepper';
import KeyboardArrowRightIcon from '@material-ui/icons/KeyboardArrowRight';

import { useStyles } from './styles';
import animate from 'utils/animate';

type Props = {
    activeStep: number;
    completed: { [k: number]: boolean };
    onChange: (index: number) => void;
    steps: string[];
};

export const MobileStepper: FC<Props> = props => {
    const { activeStep, steps, onChange, completed } = props;
    const classes = useStyles();

    const stepsRef = React.useRef<HTMLElement>(null);
    const stepRefs: HTMLElement[] = [];
    const setStepRef = (ref: HTMLElement) => stepRefs.push(ref);

    const scrollToStep = (index: number) => {
        if (stepsRef && stepsRef.current && stepRefs[index]) {
            const container = stepsRef.current;
            const step = stepRefs[index];

            const totalWidth = container.clientWidth + container.scrollLeft;
            const scrollOffset =
                container.scrollLeft -
                (totalWidth -
                    step.offsetLeft -
                    step.clientWidth / 2 -
                    container.clientWidth / 2);

            animate('scrollLeft', container, scrollOffset);
        }
    };

    useEffect(() => {
        scrollToStep(activeStep);
    }, [activeStep]);

    const handleStep = (index: number) => {
        onChange(index);

        scrollToStep(index);
    };

    const renderSteps = () => {
        return steps.map((label, index) => {
            return (
                <Step key={label} ref={setStepRef}>
                    <StepButton
                        className={classes.stepButton}
                        completed={completed[index]}
                        disabled={!completed[index]}
                        icon={null}
                        onClick={() => handleStep(index)}
                    >
                        {label}
                    </StepButton>
                </Step>
            );
        });
    };

    return (
        <Stepper
            activeStep={activeStep}
            className={classes.steps}
            connector={
                <KeyboardArrowRightIcon className={classes.iconConnector} />
            }
            nonLinear
            ref={stepsRef}
        >
            {renderSteps()}
        </Stepper>
    );
};
