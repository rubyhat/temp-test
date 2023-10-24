import { makeStyles, Theme } from '@material-ui/core/styles';
import { AtlasTheme } from 'typings/atlas-theme';

export const useStyles = makeStyles(
    (theme: Theme & AtlasTheme) => ({
        root: {
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            color: '#212B2F',
        },

        title: {
            fontSize: 20,
            fontWeight: 700,
        },
        subtitle: {
            fontSize: 14,
            marginTop: 8,
        },
    }),
    { name: 'PassengerAndSeatNumber' }
);
