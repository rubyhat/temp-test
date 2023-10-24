import React, { FC, ReactNode } from 'react';
import { makeStyles, Theme } from '@material-ui/core/styles';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import ExpansionPanel, {
    ExpansionPanelProps,
} from '@material-ui/core/ExpansionPanel';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import clsx from 'clsx';

const useStyles = makeStyles(
    (theme: Theme) => ({
        /* Styles applied to the `ExpansionPanel` component. */
        expansionPanel: {
            '&.Mui-expanded': {
                margin: theme.spacing(1, 0),
            },
        },
        /* Styles applied to the `ExpansionPanelSummary` component. */
        expansionPanelSummary: {
            padding: theme.spacing(0, 2),
            color: theme.palette.primary.main,

            '&.Mui-expanded': {
                color: theme.palette.text.primary,
            },
        },
        /* Styles applied to the `ExpansionPanelSummary` expand icon. */
        expansionPanelExpandIcon: {
            color: theme.palette.primary.main,

            '&.Mui-expanded': {
                marginTop: 0,
                marginRight: -12,
                marginLeft: 0,
                margin: theme.spacing(1, 0),
                color: theme.palette.text.primary,
            },
        },
        /* Styles applied to the `ExpansionPanelSummary` summary content. */
        expansionPanelSummaryContent: {
            '&.Mui-expanded': {
                margin: theme.spacing(1.5, 0),
            },
        },
        /* Styles applied to the `ExpansionPanelDetails` component. */
        expansionPanelDetails: {
            padding: theme.spacing(1, 2, 2),
        },
    }),
    { name: 'DesktopExpansionPanel' }
);

type Props = ExpansionPanelProps & {
    summary: ReactNode;
};

export const DesktopExpansionPanel: FC<Props> = props => {
    const { summary, children, className, ...other } = props;
    const classes = useStyles();

    return (
        <ExpansionPanel
            className={clsx(classes.expansionPanel, className)}
            elevation={0}
            square
            {...other}
        >
            <ExpansionPanelSummary
                classes={{
                    root: classes.expansionPanelSummary,
                    expandIcon: classes.expansionPanelExpandIcon,
                    content: classes.expansionPanelSummaryContent,
                }}
                expandIcon={<ExpandMoreIcon color="inherit" />}
                aria-controls="panel1d-content"
                id="panel1d-header"
            >
                {summary}
            </ExpansionPanelSummary>
            <ExpansionPanelDetails className={classes.expansionPanelDetails}>
                {children}
            </ExpansionPanelDetails>
        </ExpansionPanel>
    );
};
