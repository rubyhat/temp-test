import { makeStyles, Theme } from '@material-ui/core/styles';
import { AtlasTheme } from 'typings/atlas-theme';

export const useStyles = makeStyles(
    (theme: Theme & AtlasTheme) => ({
        root: {
            padding: `0 ${theme.spacing(2)}px`,
            marginTop: theme.spacing(3),
            '& p': {
                margin: 0,
            },
        },
        grayText: {
            color: theme.atlas.palette.text.trinity,
            fontSize: theme.spacing(1.5),
            lineHeight: `${theme.spacing(1.75)}px`,
        },
        dateTag: {
            marginBottom: theme.spacing(1.5),
        },
        card: {
            backgroundColor: theme.atlas.palette.background.white,
            borderRadius: '8px 8px 0px 0px',
            padding: theme.spacing(2),
        },
        cardHeader: {
            marginTop: theme.spacing(0.5),
            marginBottom: theme.spacing(1),
        },
        cardHeaderTitle: {
            color: theme.atlas.palette.text.base,
            fontSize: theme.spacing(2),
            margin: 0,
            marginBottom: theme.spacing(0.5),
        },
        cardHeaderSubtitle: {
            fontSize: theme.spacing(1.75),
            margin: 0,
        },
        cardAlert: {
            padding: `${theme.spacing(1)}px ${theme.spacing(2)}px`,
            color: theme.atlas.palette.text.base,
            borderRadius: '8px 8px 0px 0px',
            '& a': {
                color: '#1673D6',
            },
        },
        cardAlertText: {
            fontSize: theme.spacing(1.5),
        },
        cardAlertInfo: {
            backgroundColor: '#E0EDFC',
        },
        rideInfoRegular: {
            border: '1px solid #E2E2E2',
            borderRadius: theme.spacing(1),
            padding: `${theme.spacing(1)}px ${theme.spacing(2)}px`,
        },
        rideInfo: {
            display: 'grid',
            gridTemplateColumns: '1fr',
            gridGap: theme.spacing(1.5),
            padding: `${theme.spacing(1)}px ${theme.spacing(2)}px`,
            borderBottom: '1px solid #E2E2E2',
            borderLeft: '1px solid #E2E2E2',
            borderRight: '1px solid #E2E2E2',
            borderRadius: '0px 0px 8px 8px',
        },
        rideInfoItem: {
            display: 'grid',
            gridTemplateColumns: '1fr 3fr',
        },
        rideInfoTime: {
            display: 'flex',
            flexDirection: 'column',
            fontSize: theme.spacing(1.75),
            '& span': {
                color: '#F3660B',
                fontSize: theme.spacing(1.25),
                marginTop: theme.spacing(0.25),
                marginBottom: theme.spacing(0.25),
                lineHeight: `${theme.spacing(1.5)}px`,
            },
        },
        rideInfoContent: {},
        rideInfoContentTitle: {
            margin: 0,
            marginBottom: theme.spacing(0.25),
            fontSize: theme.spacing(1.75),
        },
        waitingTime: {
            padding: `${theme.spacing(1)}px 0`,
            borderTop: '1px solid #E2E2E2',
            borderBottom: '1px solid #E2E2E2',
        },
        rideInfoList: {
            width: '100%',
            padding: 0,
        },
        rideInfoListItem: {
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: 0,
            paddingTop: theme.spacing(1),
            paddingBottom: theme.spacing(1.5),
            fontSize: theme.spacing(1.75),
            borderBottom: '1px solid #E2E2E2',
            '&:last-child': {
                borderBottom: 'none',
            },
        },
        rideInfoListItemTitle: {
            fontSize: theme.spacing(1.75),
        },
        detailsLink: {
            fontSize: theme.spacing(2),
            color: '#1673D6',
            cursor: 'pointer',
        },
        detailsPrice: {
            fontSize: theme.spacing(2.75),
        },
        tripBenefits: {
            boxShadow: `0px 1px 8px 1px rgba(0, 0, 0, 0.08), 0px 0px 16px 2px rgba(0, 0, 0, 0.04), 0px -1px 2px rgba(0, 0, 0, 0.04)`,
            borderRadius: '0px 0px 8px 8px',
            background: '#F2F3F5',
        },
        cardFooter: {},
    }),
    { name: 'RideInfoCard' }
);
