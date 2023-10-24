import React, { FC, SyntheticEvent } from 'react';
import BaseSnackbar, {
    SnackbarOrigin,
    SnackbarProps,
} from '@material-ui/core/Snackbar';
import CloseIcon from '@material-ui/icons/Close';
import IconButton from '@material-ui/core/IconButton';

import { useStyles } from './styles';
import useSnackBar from './useSnackbar';

type Props = Omit<
    SnackbarProps,
    'autoHideDuration' | 'message' | 'onClose' | 'open' | 'variant'
>;

export const Snackbar: FC<Props> = React.memo(props => {
    const {
        anchorOrigin = {
            vertical: 'top',
            horizontal: 'center',
        } as SnackbarOrigin,
        ...rest
    } = props;
    const classes = useStyles();
    const [state, dispatch] = useSnackBar();

    const handleClose = (event?: SyntheticEvent, reason?: string) => {
        if (reason === 'clickaway') return;

        dispatch({ type: 'close', payload: {} });
    };

    return (
        <BaseSnackbar
            className={classes.root}
            anchorOrigin={anchorOrigin}
            autoHideDuration={state.timeout}
            open={state.open}
            onClose={handleClose}
            ContentProps={{
                className: classes[state.variant],
                message: (
                    <span className={classes.message}>{state.message}</span>
                ),
                action: state.hideAction
                    ? []
                    : [
                          <IconButton
                              key="close"
                              aria-label="close"
                              color="inherit"
                              onClick={handleClose}
                          >
                              <CloseIcon />
                          </IconButton>,
                      ],
            }}
            {...rest}
        />
    );
});
