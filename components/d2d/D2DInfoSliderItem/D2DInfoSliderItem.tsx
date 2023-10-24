import Box from '@material-ui/core/Box';
import Typography from '@material-ui/core/Typography';
import React from 'react';
import { useStyles } from './styles';

export interface ID2DInfoSliderItem {
    title: string;
    text: string | React.ReactNode;
    img?: string;
    srcSet?: string;
}

export const D2DInfoSliderItem = (props: ID2DInfoSliderItem) => {
    const { title, text, img, srcSet } = props;
    const classes = useStyles();
    return (
        <Box className={classes.wrapper}>
            <Typography className={classes.title} variant="h6" component="h6">
                {title}
            </Typography>
            <Typography className={classes.text} variant="body2" component="p">
                {text}
            </Typography>

            {img && (
                <img
                    className={classes.img}
                    src={img}
                    srcSet={srcSet && srcSet + ' 2x'}
                    alt="D2D"
                />
            )}
        </Box>
    );
};
