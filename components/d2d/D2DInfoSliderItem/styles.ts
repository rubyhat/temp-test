import { makeStyles, Theme } from '@material-ui/core/styles';

export const useStyles = makeStyles((theme: Theme) => ({
    title: {
        fontSize: '24px',
        lineHeight: '28px',
        marginBottom: '16px',
    },
    text: {
        marginBottom: '8px',
    },
    img: {
        display: 'block',
        width: '100%',
        marginTop: 'auto',
    },
    wrapper: {
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        // maxHeight: 'calc(100% - 50px)',
        overflow: 'hidden',
    },
}));
