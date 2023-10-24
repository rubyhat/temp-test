import React from 'react';
import { storiesOf } from '@storybook/react';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';

import { MobileStepper } from './MobileStepper';

storiesOf('ui/MobileStepper', module).add('default', () => {
    const Component = () => {
        const classes = useStyles();
        const [activeStep, setActiveStep] = React.useState(0);
        const [completed, setCompleted] = React.useState<{
            [k: number]: boolean;
        }>({});

        const totalSteps = () => steps.length;
        const completedSteps = () => Object.keys(completed).length;
        const isLastStep = () => activeStep === totalSteps() - 1;
        const allStepsCompleted = () => completedSteps() === totalSteps();

        const handleNext = () => {
            const newActiveStep =
                isLastStep() && !allStepsCompleted()
                    ? // It's the last step, but not all steps have been completed,
                      // find the first step that has been completed
                      steps.findIndex((step, i) => !(i in completed))
                    : activeStep + 1;
            setActiveStep(newActiveStep);
        };

        const handleBack = () => {
            setActiveStep(prevActiveStep => prevActiveStep - 1);
        };

        const handleStep = (step: number) => {
            setActiveStep(step);
        };

        const handleComplete = () => {
            const newCompleted = completed;
            newCompleted[activeStep] = true;
            setCompleted(newCompleted);
            handleNext();
        };

        const handleReset = () => {
            setActiveStep(0);
            setCompleted({});
        };

        return (
            <>
                <MobileStepper
                    activeStep={activeStep}
                    completed={completed}
                    steps={steps}
                    onChange={handleStep}
                />

                <div>
                    {allStepsCompleted() ? (
                        <div>
                            <Typography className={classes.instructions}>
                                All steps completed - you&apos;re finished
                            </Typography>
                            <Button onClick={handleReset}>Reset</Button>
                        </div>
                    ) : (
                        <div>
                            <Typography className={classes.instructions}>
                                {getStepContent(activeStep)}
                            </Typography>
                            <div>
                                <Button
                                    disabled={activeStep === 0}
                                    onClick={handleBack}
                                    className={classes.button}
                                >
                                    Back
                                </Button>
                                <Button
                                    variant="contained"
                                    color="primary"
                                    onClick={handleNext}
                                    className={classes.button}
                                >
                                    Next
                                </Button>
                                {activeStep !== steps.length &&
                                    (completed[activeStep] ? (
                                        <Typography
                                            variant="caption"
                                            className={classes.completed}
                                        >
                                            Step {activeStep + 1} already
                                            completed
                                        </Typography>
                                    ) : (
                                        <Button
                                            variant="contained"
                                            color="primary"
                                            onClick={handleComplete}
                                        >
                                            {completedSteps() ===
                                            totalSteps() - 1
                                                ? 'Finish'
                                                : 'Complete Step'}
                                        </Button>
                                    ))}
                            </div>
                        </div>
                    )}
                </div>
            </>
        );
    };

    return <Component />;
});

const steps = [
    'Пассажиры',
    'Выбор мест',
    'Дополнительные услуги',
    'Места посадки и высадки',
    'Оплата',
];

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {
            width: '90%',
        },
        button: {
            marginRight: theme.spacing(1),
        },
        completed: {
            display: 'inline-block',
        },
        instructions: {
            marginTop: theme.spacing(1),
            marginBottom: theme.spacing(1),
        },
    })
);

function getStepContent(step: number) {
    switch (step) {
        case 0:
            return 'Step 1: Сколько пассажиров?';
        case 1:
            return 'Step 2: Выберите места в салоне';
        case 2:
            return 'Step 3: Выберите дополнительные услуги';
        case 3:
            return 'Step 4: Выберите места посадки и высадки';
        case 4:
            return 'Step 5: Оплата';
        default:
            return 'Unknown step';
    }
}
