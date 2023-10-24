import React, { TouchEvent, TouchList, useEffect, useRef } from 'react';
import Modal, { ModalProps } from '@material-ui/core/Modal';
import Paper, { PaperProps } from '@material-ui/core/Paper';
import Slide, { SlideProps } from '@material-ui/core/Slide';
import clsx from 'clsx';
import { BackdropProps } from '@material-ui/core/Backdrop';
import { Styles } from '@material-ui/styles';
import { TransitionProps } from '@material-ui/core/transitions';
import { duration, Theme, withStyles } from '@material-ui/core/styles';

import { BottomSheetNotch } from './BottomSheetNotch';
import { AtlasTheme } from 'typings/atlas-theme';
export const defaultPeekHeight = 64;

export const styles: Styles<Theme, PersistentBottomSheetProps> = (
    theme: Theme
) => {
    const atlasTheme = theme as Theme & AtlasTheme;

    return {
        /* Styles applied to the root element. */
        root: {},
        /* Styles applied to the BottomSheetNotch component. */
        bottomSheetNotch: {
            marginTop: theme.spacing(1),
            marginBottom: theme.spacing(2),
        },
        /* Styles applied to the Paper component. */
        paper: {
            overflowY: 'auto',
            display: 'flex',
            flexDirection: 'column',
            flex: '1 0 auto',
            zIndex: theme.zIndex.drawer,
            WebkitOverflowScrolling: 'touch', // Add iOS momentum scrolling.
            // temporary style
            position: 'fixed',
            // We disable the focus ring for mouse, touch and keyboard users.
            // At some point, it would be better to keep it for keyboard users.
            // :focus-ring CSS pseudo-class will help.
            outline: 0,

            top: 'auto',
            left: 0,
            bottom: 0,
            right: 0,
            height: 'auto',
            maxHeight: '100%',

            backgroundColor: theme.palette.common.white,
            boxShadow: atlasTheme.atlas.shadows.above,
            borderTopLeftRadius: atlasTheme.atlas.borderRadius.high,
            borderTopRightRadius: atlasTheme.atlas.borderRadius.high,
        },
        /* Styles applied to the Paper component if `state="collapsed"`. */
        paperCollapsed: {
            overflowY: 'hidden', // disable scrolling
        },
        /* Styles applied to the Paper component if `state="expanded"`. */
        paperExpanded: {},
        /* Styles applied to the Modal component. */
        modal: {},
    };
};

export type PersistentBottomSheetProps = {
    /**
     * Props applied to the [`Backdrop`](/api/backdrop/) element.
     */
    BackdropProps?: BackdropProps;
    /**
     * The content of the component.
     */
    children?: React.ReactNode;
    /**
     * Override or extend the styles applied to the component.
     */
    classes?: {
        /** Styles applied to the root element. */
        root?: string;
        /** Styles applied to the BottomSheetNotch component. */
        bottomSheetNotch?: string;
        /** Styles applied to the Paper component. */
        paper?: string;
        /** Styles applied to the Paper component if `state="collapsed"`. */
        paperCollapsed?: string;
        /** Styles applied to the Paper component if `state="expanded"`. */
        paperExpanded?: string;
        /** Styles applied to the Modal component. */
        modal?: string;
    };
    /**
     * @ignore
     */
    className?: string;
    /**
     * If `true`, hide the bottom sheet notch.
     * @default false
     */
    hideNotch?: boolean;
    /**
     * Defines, from which (average) velocity on, the swipe is
     * defined as complete although hysteresis isn't reached.
     * Good threshold is between 250 - 1000 px/s
     * @default 450
     */
    minFlingVelocity?: number;
    /**
     * Props applied to the [`Modal`](/api/modal/) element.
     * @default {}
     */
    ModalProps?: Partial<ModalProps>;
    /**
     * Callback fired when the component requests to be closed.
     *
     * @param {object} event The event source of the callback.
     */
    onClose?: ModalProps['onClose'];
    /**
     * Callback fired when the component requests a change of state.
     */
    onStateChange: (state: PersistentBottomSheetState) => void;
    /**
     * If `true`, the component is shown.
     * @default false
     */
    open?: boolean;
    /**
     * Props applied to the [`Paper`](/api/paper/) element.
     * @default {}
     */
    PaperProps?: Partial<PaperProps>;
    /**
     * Peek height when bottom sheet is collapsed.
     */
    peekHeight?: number;
    /**
     * Props applied to the [`Slide`](/api/slide/) element.
     */
    SlideProps?: Partial<SlideProps>;
    /**
     * The components accept a TransitionComponent prop to customize the default transitions.
     */
    TransitionComponent?: React.ComponentType<TransitionProps>;
    /**
     * The duration for the transition, in milliseconds.
     * You may specify a single timeout for all transitions, or individually with an object.
     * @default { enter: duration.enteringScreen, exit: duration.leavingScreen }
     */
    transitionDuration?: TransitionProps['timeout'];
    /**
     * In total, a BottomSheet has five states and with the help of these
     * states, we can perform various actions according to our need.
     *
     * - [collapsed]: The BottomSheet is visible up to its peek height only.
     * - [expanded]: The BottomSheet is fully expanded to its maximum height and
     * all the content of the BottomSheet is visible.
     *
     * @inspiration https://blog.mindorks.com/android-bottomsheet-in-kotlin
     */
    state?: PersistentBottomSheetState;
};

export type PersistentBottomSheetState = 'collapsed' | 'expanded';

export type SwipeInstance = {
    startY: number;
    velocity: number;
    lastTranslate: number;
    lastTime: number;
    isSwiping: boolean;
};

// This value is closed to what browsers are using internally to
// trigger a native scroll.
const UNCERTAINTY_THRESHOLD = 3; // px

const defaultTransitionDuration = {
    enter: duration.enteringScreen,
    exit: duration.leavingScreen,
};

function calculateCurrentY(touches: TouchList, containerWindow: Window) {
    return containerWindow.innerHeight - touches[0].clientY;
}

function calculateTranslate(
    currentTranslate: number,
    swipeInstance: SwipeInstance,
    maxTranslate: number,
    state: PersistentBottomSheetState,
    paperInstance: HTMLElement,
    peekHeight: number
) {
    if (state === 'collapsed') {
        return Math.max(
            paperInstance.clientHeight -
                swipeInstance.startY -
                currentTranslate,
            0
        );
    }

    // expanded
    return Math.max(swipeInstance.startY - currentTranslate, maxTranslate);
}

function calculateTranslateByState(
    state: PersistentBottomSheetState,
    paperInstance: HTMLElement,
    peekHeight: number
) {
    if (state === 'collapsed') {
        return paperInstance.clientHeight - peekHeight;
    }

    // expanded
    return 0;
}

function calculateMaxTranslate() {
    return 0;
}

function calculateVelocity(translate: number, swipeInstance: SwipeInstance) {
    return (
        ((translate - swipeInstance.lastTranslate) /
            (performance.now() - swipeInstance.lastTime)) *
        1e3
    );
}

function ownerDocument(node: Node | null | undefined): Document {
    return (node && node.ownerDocument) || document;
}

function ownerWindow(node: Node | undefined): Window {
    const doc = ownerDocument(node);
    return doc.defaultView || window;
}

// Вычислит в какое состояние нужно перевести BottomSheet
// на основе направления и скорости свайпа.
function whoseStateTerritory(
    currentState: PersistentBottomSheetState,
    currentY: number,
    velocity: number,
    minFlingVelocity: number,
    peekHeight: number
): PersistentBottomSheetState {
    // negative velocity means swipe up
    const swipeDirection = velocity < 0 ? 'up' : 'down';

    if (
        currentState === 'expanded' &&
        (currentY < peekHeight ||
            (swipeDirection === 'down' && velocity > minFlingVelocity))
    ) {
        return 'collapsed';
    }

    if (
        currentState === 'collapsed' &&
        (currentY > peekHeight ||
            (swipeDirection === 'up' && Math.abs(velocity) > minFlingVelocity))
    ) {
        return 'expanded';
    }

    return currentState;
}

const PersistentBottomSheetComponent = React.forwardRef<
    HTMLDivElement,
    PersistentBottomSheetProps
>((props, ref) => {
    const {
        BackdropProps,
        children,
        className,
        classes = {},
        hideNotch,
        minFlingVelocity = 450,
        ModalProps: {
            BackdropProps: BackdropPropsProp = {},
            ...ModalProps
        } = {},
        onClose,
        onStateChange,
        open = false,
        PaperProps = {},
        peekHeight = defaultPeekHeight,
        SlideProps,
        state = 'collapsed',
        // eslint-disable-next-line react/prop-types
        TransitionComponent = Slide,
        transitionDuration = defaultTransitionDuration,
        ...other
    } = props;

    const paperRef = useRef<HTMLDivElement | null>(null);
    const swipeInstance = useRef<SwipeInstance>({
        startY: 0,
        velocity: 0,
        lastTranslate: 0,
        lastTime: 0,
        isSwiping: false,
    });

    const handleTouchStart = (e: TouchEvent<HTMLDivElement>) => {
        const currentY = calculateCurrentY(
            e.touches,
            ownerWindow(e.currentTarget)
        );

        swipeInstance.current.startY = currentY;
    };

    const handleTouchMove = (e: TouchEvent<HTMLDivElement>) => {
        // the ref may be null when a parent component updates while swiping
        if (!paperRef.current) {
            return;
        }

        const currentY = calculateCurrentY(
            e.touches,
            ownerWindow(e.currentTarget)
        );

        // We don't know yet.
        if (!swipeInstance.current.isSwiping) {
            const dy = Math.abs(currentY - swipeInstance.current.startY);
            const definitelySwiping = dy > UNCERTAINTY_THRESHOLD;

            swipeInstance.current.isSwiping = definitelySwiping;
        }

        if (!swipeInstance.current.isSwiping) {
            return;
        }

        const maxTranslate = calculateMaxTranslate();
        const translate = calculateTranslate(
            currentY,
            swipeInstance.current,
            maxTranslate,
            state,
            paperRef.current,
            peekHeight
        );

        const velocity = calculateVelocity(translate, swipeInstance.current);

        swipeInstance.current.lastTranslate = translate;
        swipeInstance.current.lastTime = performance.now() + 1;

        // Low Pass filter.
        swipeInstance.current.velocity =
            swipeInstance.current.velocity * 0.4 + velocity * 0.6;

        paperRef.current.style.transform = `translate(0, ${translate}px`;
        paperRef.current.style.transition = '';
    };

    const handleTouchEnd = (e: TouchEvent<HTMLDivElement>) => {
        if (!paperRef.current) return;

        // The swipe wasn't started.
        if (!swipeInstance.current.isSwiping) return;
        swipeInstance.current.isSwiping = false;

        const currentY = calculateCurrentY(
            e.changedTouches,
            ownerWindow(e.currentTarget)
        );

        const stateTerritory = whoseStateTerritory(
            state,
            currentY,
            swipeInstance.current.velocity,
            minFlingVelocity,
            peekHeight
        );
        const translate = calculateTranslateByState(
            stateTerritory,
            paperRef.current,
            peekHeight
        );

        paperRef.current.style.transform = `translate(0, ${translate}px)`;
        paperRef.current.style.transition =
            'all 195ms cubic-bezier(0.4, 0, 0.2, 1) 0ms';

        onStateChange(stateTerritory);
    };

    // Let's assume that the Drawer will always be rendered on user space.
    // We use this state is order to skip the appear transition during the
    // initial mount of the component.
    const mounted = useRef(false);
    useEffect(() => {
        mounted.current = true;
    }, []);

    // Recalculate bottom sheet position if the state has changed
    useEffect(() => {
        if (!paperRef.current) return;

        const translate = calculateTranslateByState(
            state,
            paperRef.current,
            peekHeight
        );

        paperRef.current.style.transform = `translate(0, ${translate}px)`;
        paperRef.current.style.transition =
            'all 195ms cubic-bezier(0.4, 0, 0.2, 1) 0ms';
    }, [state]);

    const bottomSheet = (
        <Paper
            elevation={0} // we have our own shadows
            square
            {...PaperProps}
            className={clsx(
                classes.paper,
                PaperProps.className,
                state === 'collapsed' && classes.paperCollapsed,
                state === 'expanded' && classes.paperExpanded
            )}
            ref={paperRef}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
        >
            {!hideNotch ? (
                <BottomSheetNotch className={classes.bottomSheetNotch} />
            ) : null}

            {children}
        </Paper>
    );

    const slidingBottomSheet = (
        <TransitionComponent
            in={open}
            direction="up"
            timeout={transitionDuration}
            appear={mounted.current}
            {...SlideProps}
        >
            {bottomSheet}
        </TransitionComponent>
    );

    return (
        <Modal
            BackdropProps={{
                ...BackdropProps,
                ...BackdropPropsProp,
                transitionDuration,
            }}
            hideBackdrop // Disable the backdrop color/image
            disableEnforceFocus // Let the user focus on elements outside the dialog
            disableBackdropClick // Remove the backdrop click (just to be sure)
            style={{ position: 'initial' }} // This was the key point, reset the position of the dialog, so the user can interact with other elements
            className={clsx(classes.root, classes.modal, className)}
            open={open}
            onClose={onClose}
            ref={ref}
            {...other}
            {...ModalProps}
        >
            {slidingBottomSheet}
        </Modal>
    );
});

export const PersistentBottomSheet = withStyles(styles, {
    name: 'PersistentBottomSheet',
})(PersistentBottomSheetComponent);
