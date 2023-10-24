import React from 'react';
import clsx from 'clsx';
import { SeatButton } from 'components/SeatButton';
import Box from '@material-ui/core/Box';
import { useStyles } from 'components/MobileSeatStep/styles';
import { SeatsSchemaTabs } from 'components/SeatsSchemaTabs';
import { SeatingSchemeDto } from 'swagger/client';
import { usePlatform } from 'hooks/usePlatform';
import { useSelector } from 'react-redux';
import { RootState } from 'store';
import { BookingState } from 'store/booking/types';
import { Typo } from 'components/Typo/Typo';
import { SchemaGroup } from 'components/MobileSeatStep/SchemaGroup';
import { useTranslation } from 'i18n';

interface MobileSeatStep {
    seatingScheme: SeatingSchemeDto[];
    numberOfPassengers: number;
    inModal?: boolean;
}

export const MobileSeatStep = (props: MobileSeatStep) => {
    const { t } = useTranslation();
    const { isDesktop } = usePlatform();
    const { seatingScheme, numberOfPassengers, inModal } = props;
    // Табы этажей
    const [activeTab, setActiveTab] = React.useState(0);
    const isVisibleTabs = seatingScheme.length > 1;

    const sections = seatingScheme[activeTab] || [];
    const groups = sections.groups || [];
    const { across } = groups[0];
    const along = 1;
    const classes = useStyles({
        along,
        across,
        isDesktop,
        tabCount: seatingScheme.length,
        inModal: inModal || false,
    });
    const { selectedSeats } = useSelector<RootState, BookingState>(
        rootState => rootState.booking
    );

    const renderSchema = () => {
        if (Array.isArray(sections.groups)) {
            return (
                <Box className={classes.root}>
                    {sections.groups.map(({ cells }, key) => (
                        // @todo вынести в отдельный компонент
                        // <SchemaGroup key={key} cells={cells} />

                        <Box key={key} className={classes.seatWrap}>
                            {cells.map((cell, index) => (
                                <SeatButton
                                    cell={cell}
                                    selectedSeats={selectedSeats}
                                    key={index}
                                    numberOfPassengers={numberOfPassengers}
                                />
                            ))}
                        </Box>
                    ))}
                </Box>
            );
        }
    };

    return (
        <>
            {isVisibleTabs && (
                <Box className={classes.tabWrap}>
                    {seatingScheme.map((item, index) => (
                        <Box
                            onClick={() => setActiveTab(index)}
                            className={clsx(
                                classes.tab,
                                activeTab === index && classes.tabActive
                            )}
                        >
                            {item.label}
                        </Box>
                    ))}
                </Box>
            )}
            {renderSchema()}
            <Typo className={classes.infoText}>
                {t('selectSeatAboutSchema')}
            </Typo>
        </>
    );
};
