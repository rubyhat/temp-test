import * as React from 'react';
import Dialog from '@material-ui/core/Dialog';
import {
    Box,
    IconButton,
    useTheme,
    Grid,
    Chip,
    Typography,
} from '@material-ui/core';
import CloseIcon from '@material-ui/icons/Close';
import clsx from 'clsx';
import SwipeableViews from 'react-swipeable-views';
import { useTranslation } from 'i18n';
import {
    D2DInfoSliderItem,
    ID2DInfoSliderItem,
} from 'components/d2d/D2DInfoSliderItem';
import { useStyles } from './styles';
import { AtlasTheme } from 'typings/atlas-theme';
import { useSAAS } from 'hooks/useSAAS';
export const D2DInfoSlider = () => {
    const [activeStep, setActiveStep] = React.useState(0);
    const [open, setOpen] = React.useState(false);
    const classes = useStyles();
    const theme = useTheme() as AtlasTheme;
    const { isMioTaxi } = useSAAS();

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
        document.body.style.overflow = 'auto';
    };

    const handleClickPagination = (direction: string) => {
        if (direction === 'left') {
            setActiveStep(current => (current !== 0 ? current - 1 : current));
        } else {
            setActiveStep(current =>
                current !== slides.length - 1 ? current + 1 : current
            );
        }
    };

    const handleStepChange = (step: number) => {
        setActiveStep(step);
    };

    const RenderSlideIndicator = (props: { index: number }) => {
        const { index } = props;
        return (
            <Box
                key={index}
                className={clsx(
                    classes.step,
                    activeStep === index && classes.stepActive
                )}
            ></Box>
        );
    };

    const { t } = useTranslation();

    const slides = React.useMemo(
        () => [
            {
                id: 1,
                title: t('booking:infoSliderTitleWhatIsIt'),
                text: t('booking:infoSliderTextWhatIsIt'),
            },
            {
                id: 2,
                title: t('booking:infoSliderTitleHowItWorks'),
                text: t('booking:infoSliderTextHowItWorks'),
                img: '/static/img/d2d-road-animation.gif',
            },
            {
                id: 3,
                title: t('booking:infoSliderTitleAbout'),
                text: t('booking:infoSliderTextAbout'),
                img: '/static/img/img-d2d-notes-x2.png',
                srcSet: '/static/img/img-d2d-notes-x2.png',
            },
        ],
        [t]
    );

    const slidesMioTaxi = React.useMemo(
        () => [
            {
                id: 1,
                title: 'Что такое шеринг такси?',
                text: (
                    <>
                        <Typography
                            className={classes.text}
                            variant="body2"
                            component="p"
                        >
                            На этом экране вы можете выбрать точку, с которой
                            вас нужно забрать.
                        </Typography>
                        <Typography
                            className={classes.text}
                            variant="body2"
                            component="p"
                        >
                            Время отправления указано точное. Однако, если
                            водитель будет задерживаться, он обязательно
                            позвонит заранее.'
                        </Typography>
                    </>
                ),
                img: '/static/img/d2d-road-animation.gif',
            },
        ],
        [classes.text]
    );

    const renderSlides: ID2DInfoSliderItem[] = isMioTaxi
        ? slidesMioTaxi
        : slides;

    return (
        <Grid item>
            <Chip
                className={clsx(classes.chip)}
                style={{ backgroundColor: 'white' }}
                clickable
                onClick={handleClickOpen}
                variant="outlined"
                color="primary"
                size="small"
                label={t('booking:infoSliderOpenButton')}
            />
            <Dialog
                disableScrollLock
                fullScreen
                open={open}
                onClose={handleClose}
            >
                <Box className={classes.dialog}>
                    <Box className={classes.header}>
                        {renderSlides.map((_, index) => (
                            <RenderSlideIndicator key={index} index={index} />
                        ))}
                    </Box>
                    <Box className={classes.closeBar}>
                        <IconButton onClick={handleClose}>
                            <CloseIcon
                                style={{
                                    fill: theme.atlas.palette.background.white,
                                }}
                            />
                        </IconButton>
                    </Box>

                    <Box className={classes.slider}>
                        {renderSlides.length > 1 && (
                            <Box
                                className={clsx([
                                    classes.toLeft,
                                    classes.pagination,
                                ])}
                                onClick={() => handleClickPagination('left')}
                            ></Box>
                        )}
                        <SwipeableViews
                            index={activeStep}
                            onChangeIndex={handleStepChange}
                            enableMouseEvents
                            containerStyle={{ height: '100%' }}
                        >
                            {renderSlides.map((item, index) => (
                                <D2DInfoSliderItem
                                    key={index}
                                    title={item.title}
                                    text={item.text}
                                    img={item.img && item.img}
                                />
                            ))}
                        </SwipeableViews>
                        {renderSlides.length > 1 && (
                            <Box
                                className={clsx([
                                    classes.toRight,
                                    classes.pagination,
                                ])}
                                onClick={() => handleClickPagination('right')}
                            ></Box>
                        )}
                    </Box>
                </Box>
            </Dialog>
        </Grid>
    );
};
