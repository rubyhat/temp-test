import { makeStyles, Theme } from '@material-ui/core/styles';
import { AtlasTheme } from 'typings/atlas-theme';

interface Props {
    along: number;
    across: number;
    tabCount: number;
    isDesktop: boolean;
    inModal: boolean;
}

export const useStyles = makeStyles(
    (theme: Theme & AtlasTheme) => ({
        root: {
            display: 'flex',
            alignItems: 'center',
            flexDirection: 'column',
            borderRadius: theme.spacing(1),
            boxShadow:
                '0px 1px 8px 1px rgba(0, 0, 0, 0.08), 0px 0px 16px 2px rgba(0, 0, 0, 0.04), 0px -1px 2px rgba(0, 0, 0, 0.04)',
            padding: theme.spacing(2),
            [theme.breakpoints.up('md')]: {
                boxShadow: ({ inModal }: Props) =>
                    inModal
                        ? 'none'
                        : '0px 2px 4px rgba(8, 78, 104, 0.12), 0px 0px 2px rgba(8, 78, 104, 0.18)',
            },
        },
        seatWrap: {
            display: 'grid',
            gridTemplateRows: ({ across, along, isDesktop }: Props) =>
                `repeat(${isDesktop ? along : along}, 44px)`,
            gridTemplateColumns: ({ across, along, isDesktop }: Props) =>
                `repeat(${isDesktop ? across : across}, 44px)`,
            gridAutoFlow: ({ across, along, isDesktop }: Props) =>
                isDesktop ? 'row' : 'row',
            gridGap: 10,
            opacity: 1,
        },
        tabWrap: {
            border: '1px solid #E2E2E2',
            borderRadius: theme.spacing(1),
            display: 'grid',
            gridTemplateColumns: ({ tabCount }: Props) =>
                `repeat(${tabCount}, 1fr)`,
            marginBottom: '16px',
        },
        tab: {
            padding: theme.spacing(1),
            textAlign: 'center',
            fontWeight: 600,
            fontSize: 14,
            color: '#68787D',
            cursor: 'pointer',
        },
        tabActive: {
            background: '#fff',
            border: '1px solid #E2E2E2',
            borderRadius: theme.spacing(1),
            color: '#212B2F',
        },
        infoText: {
            color: 'rgba(5, 38, 48, 0.62);',
            fontSize: theme.spacing(1.5),
            textAlign: 'center',
            marginTop: theme.spacing(2.5),
            [theme.breakpoints.up('md')]: {
                display: 'none',
            },
        },
    }),
    { name: 'MobileSeatStep' }
);
