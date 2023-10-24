import React, { FC } from 'react';
import CancelIcon from '@material-ui/icons/Cancel';
import { makeStyles, Theme } from '@material-ui/core/styles';
import clsx from 'clsx';

import { Typo } from '../Typo/Typo';
import {
    formatCardExpirationDate,
    getCardNameByMask,
} from 'utils/credit-cards';
import { CardDto } from 'swagger/client';

const useStyles = makeStyles(
    (theme: Theme) => ({
        /* Styles applied to the root element. */
        root: {
            backgroundColor: '#FFF',
            padding: theme.spacing(2),
            position: 'relative',
        },
        /* Styles applied to the title `div` element. */
        cardTitle: {
            display: 'flex',
            alignItems: 'center',
        },
        /* Styles applied to the card.mask `Typo` component. */
        cardMask: {},
        /* Styles applied to the card.expires `Typo` component. */
        cardExpirationDate: {
            marginLeft: theme.spacing(1),
        },
        /* Styles applied to the delete `Icon` component. */
        deleteIcon: {
            position: 'absolute',
            top: theme.spacing(2),
            right: theme.spacing(2),
        },
    }),
    { name: 'CreditCard' }
);

type Props = {
    card: CardDto;
    onDelete?: (cardId: number) => void;
    onClick?: (cardId: CardDto) => void;
    className?: string;
};

export const CreditCard: FC<Props> = props => {
    const { card, className, onDelete, onClick } = props;
    const classes = useStyles();

    const handleDelete = () => onDelete && onDelete(card.id);
    const handleClick = () => onClick && onClick(card);

    return (
        <div className={clsx(className, classes.root)} onClick={handleClick}>
            <div className={classes.cardTitle}>
                <Typo
                    variant="body1"
                    weight="bold"
                    className={classes.cardMask}
                >
                    {getCardNameByMask(card.cardMask)}
                </Typo>

                {card.expires ? (
                    <Typo
                        variant="body5"
                        color="textSecondary"
                        className={classes.cardExpirationDate}
                    >
                        {formatCardExpirationDate(card.expires)}
                    </Typo>
                ) : null}
            </div>

            {onDelete ? (
                <div className={classes.deleteIcon}>
                    <CancelIcon
                        onClick={handleDelete}
                        fontSize="default"
                        color="primary"
                    />
                </div>
            ) : null}
        </div>
    );
};
