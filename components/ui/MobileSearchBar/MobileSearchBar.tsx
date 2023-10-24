import React, {
    ChangeEvent,
    FC,
    ReactNode,
    FocusEvent,
    MouseEvent,
    useRef,
    ReactElement,
} from 'react';
import AppBar from '@material-ui/core/AppBar';
import Button from '@material-ui/core/Button';
import CancelIcon from '@material-ui/icons/Cancel';
import Dialog from '@material-ui/core/Dialog';
import Divider from '@material-ui/core/Divider';
import InputBase from '@material-ui/core/InputBase';
import List from '@material-ui/core/List';
import Slide, { SlideProps } from '@material-ui/core/Slide';
import Toolbar from '@material-ui/core/Toolbar';

import { useStyles } from './styles';

type Props<T = any> = {
    value: string;
    onChange: (value: string) => void;
    open: boolean;
    onClose: (event: object, reason: string) => void;
    items: T[];
    renderItem: (item: T, index: number) => ReactNode;
    placeholder?: string;
    cancelButtonLabel?: string;
    onClear?: () => void;
    onBlur?: (e: FocusEvent<HTMLInputElement>) => void;
    autoSelect?: boolean;
    renderSubheader?: () => ReactElement | null;
};

const Transition = React.forwardRef<unknown, SlideProps>(function Transition(
    props,
    ref
) {
    return <Slide direction="up" ref={ref} {...props} />;
});
Transition.displayName = 'Transition';

export const MobileSearchBar: FC<Props> = React.memo(props => {
    const {
        open,
        onClose,
        value,
        onChange,
        items,
        renderItem,
        placeholder = '',
        cancelButtonLabel = '',
        onClear,
        onBlur,
        autoSelect = false,
        renderSubheader,
    } = props;
    const classes = useStyles();

    const inputRef = useRef<HTMLElement>(null);

    const showClearIcon = !!value;
    const handleClose = (event: MouseEvent<HTMLElement>) => {
        onClose(event, 'closeButton');
    };
    const handleInput = (
        event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
        onChange(event.target.value);
    };
    const handleClearIcon = () => {
        onChange('');
        if (onClear) {
            onClear();
        }
        if (inputRef && inputRef.current) {
            inputRef.current.focus();
        }
    };

    const renderItems = () =>
        items.map((item, index) => {
            return (
                <React.Fragment key={index}>
                    {renderItem(item, index)}
                    {index + 1 < items.length ? (
                        <Divider variant="middle" />
                    ) : null}
                </React.Fragment>
            );
        });

    return (
        <Dialog
            disableScrollLock
            fullScreen
            open={open}
            onClose={onClose}
            TransitionComponent={Transition}
        >
            <AppBar className={classes.appBar} color="inherit" position="fixed">
                <Toolbar className={classes.toolbar}>
                    <div className={classes.search}>
                        <InputBase
                            value={value}
                            onFocus={e => autoSelect && e.target.select()}
                            onChange={handleInput}
                            onBlur={onBlur}
                            placeholder={placeholder}
                            classes={{
                                root: classes.inputRoot,
                                input: classes.inputInput,
                            }}
                            inputProps={{ 'aria-label': 'search' }}
                            autoFocus
                            inputRef={inputRef}
                        />
                        {showClearIcon && (
                            <div
                                onClick={handleClearIcon}
                                className={classes.clearIcon}
                            >
                                <CancelIcon fontSize="small" />
                            </div>
                        )}
                    </div>
                    <Button
                        id="mobile-searchbar-close"
                        className={classes.cancelButton}
                        color="primary"
                        onClick={handleClose}
                    >
                        {cancelButtonLabel}
                    </Button>
                </Toolbar>
            </AppBar>
            <List
                className={classes.list}
                subheader={(renderSubheader && renderSubheader()) || undefined}
            >
                {renderItems()}
            </List>
        </Dialog>
    );
});
