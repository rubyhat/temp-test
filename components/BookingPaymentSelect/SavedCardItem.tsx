import React, { FC } from 'react';
import clsx from 'clsx';
import { makeStyles, Theme } from '@material-ui/core/styles';
import ListItemText from '@material-ui/core/ListItemText';

import { CardDto } from 'swagger/client';
import { Typo } from '../Typo/Typo';
import {
    formatCardExpirationDate,
    getCardNameByMask,
} from 'utils/credit-cards';
import { AtlasTheme } from 'typings/atlas-theme';
const useStyles = makeStyles(
    (theme: Theme & AtlasTheme) => ({
        /* Styles applied to the root element. */
        root: {},
        expirationDate: {
            marginLeft: theme.spacing(1),
            fontSize: theme.atlas.typography.body6.fontSize,
            lineHeight: '18px',
        },
    }),
    { name: 'SavedCardItem' }
);

type SavedCardItemProps = {
    className?: string;
    card: CardDto;
};

export const SavedCardItem: FC<SavedCardItemProps> = props => {
    const { className, card } = props;
    const classes = useStyles();

    return (
        <ListItemText
            className={clsx(classes.root, className)}
            primary={
                <div>
                    <Typo component="span">
                        {getCardNameByMask(card.cardMask)}
                    </Typo>

                    {card.expires ? (
                        <Typo
                            component="span"
                            color="textSecondary"
                            variant="body5"
                            className={classes.expirationDate}
                        >
                            {formatCardExpirationDate(card.expires)}
                        </Typo>
                    ) : null}
                </div>
            }
        />
    );
};
