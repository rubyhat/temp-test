import { makeStyles, Theme } from '@material-ui/core/styles';
import { AtlasTheme } from 'typings/atlas-theme';

export const useStyles = makeStyles(
    (theme: Theme & AtlasTheme) => ({
        root: {
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
            padding: theme.spacing(2.5),
            boxShadow:
                '0px 1px 8px 1px rgba(0, 0, 0, 0.08), 0px 0px 16px 2px rgba(0, 0, 0, 0.04), 0px -1px 2px rgba(0, 0, 0, 0.04)',
            borderRadius: theme.spacing(1),
        },
        cardHeader: {
            marginTop: theme.spacing(0.5),
            marginBottom: theme.spacing(1),
            marginLeft: theme.spacing(2),
        },
        cardHeaderTitle: {
            color: theme.atlas.palette.text.base,
            fontSize: theme.spacing(2.25),
            margin: 0,
            marginBottom: theme.spacing(0.75),
        },
        cardHeaderSubtitle: {
            fontSize: theme.spacing(2),
            margin: '6px 0 16px',
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
        rideInfoWrap: {
            display: 'grid',
            gridTemplateColumns: '1.75fr 1.75fr 1fr',
            gridGap: '50px',
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
            gridTemplateColumns: '1fr 1.75fr',
            gridGap: theme.spacing(1),
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
            padding: 0,
            paddingBottom: theme.spacing(1),
            fontSize: theme.spacing(1.75),
            '& p': {
                marginRight: theme.spacing(0.5),
            },
        },
        rideInfoListItemTitle: {
            fontSize: theme.spacing(2),
        },
        busInfoWrap: {
            display: 'grid',
            gridTemplateColumns: '3fr 1fr',
            gridGap: '50px',
        },
        rideStatusBlock: {},
        rideStatus: {
            fontSize: theme.spacing(2),
            color: '#68787D',
        },
        ridePriceBlock: {
            display: 'flex',
            flexDirection: 'column',
            borderLeft: '1px solid #e2e2e2',
            paddingLeft: '40px',
        },
        detailsLink: {
            fontSize: theme.spacing(2),
            color: '#1673D6',
            cursor: 'pointer',
        },
        detailsPrice: {
            textAlign: 'center',
            fontSize: theme.spacing(2.75),
            margin: 0,
            color: '#212B2F',
        },
        detailsPayMethod: {
            textAlign: 'center',
            color: '#68787D',
            fontSize: theme.spacing(1.75),
            marginTop: theme.spacing(1),
            marginBottom: theme.spacing(2),
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
