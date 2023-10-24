import React, { FC } from 'react';
import CancelIcon from '@material-ui/icons/Cancel';
import camelCase from 'lodash/camelCase';
import clsx from 'clsx';
import parseISO from 'date-fns/parseISO';
import upperFirst from 'lodash/upperFirst';
import { makeStyles, Theme } from '@material-ui/core/styles';

import { Typo } from '../Typo/Typo';
import { format } from 'utils/date';
import { PersonalDataDto } from 'swagger/client';
import { useTranslation } from 'i18n';

const useStyles = makeStyles(
    (theme: Theme) => ({
        /* Styles applied to the root element. */
        root: {
            backgroundColor: '#FFF',
            padding: theme.spacing(2),
            position: 'relative',
        },
        /* Styles applied to the `Typo` component. */
        typo: {
            '& ~ &': {
                marginTop: theme.spacing(1),
            },
        },
        /* Styles applied to the delete `Icon` component. */
        deleteIcon: {
            position: 'absolute',
            top: theme.spacing(2),
            right: theme.spacing(2),
        },
    }),
    { name: 'PassengerDocument' }
);

type Props = {
    doc: PersonalDataDto;
    onDelete?: (document: PersonalDataDto) => void;
    onClick?: (document: PersonalDataDto) => void;
    className?: string;
};

export const PassengerDocument: FC<Props> = props => {
    const { doc, className, onDelete, onClick } = props;
    const classes = useStyles();
    const { t } = useTranslation();

    const handleDelete = () => onDelete && onDelete(doc);
    const handleClick = () => onClick && onClick(doc);

    return (
        <div className={clsx(className, classes.root)} onClick={handleClick}>
            <Typo variant="body1" weight="bold" className={classes.typo}>
                {doc.surname} {doc.name} {doc.patronymic}
            </Typo>

            {doc.birthday || doc.gender ? (
                <Typo
                    variant="body1"
                    color="textSecondary"
                    className={classes.typo}
                >
                    {doc.birthday
                        ? format(parseISO(doc.birthday), 'dd.MM.yyyy')
                        : null}
                    {doc.birthday && doc.gender ? ', ' : ''}
                    {doc.gender ? t(`profile:gender${doc.gender}`) : null}
                </Typo>
            ) : null}

            {doc.docType && doc.docNum ? (
                <Typo
                    variant="body1"
                    color="textSecondary"
                    className={classes.typo}
                >
                    {t(
                        `profile:docTypeName${upperFirst(
                            camelCase(doc.docType)
                        )}`
                    )}{' '}
                    {doc.docNum}
                </Typo>
            ) : null}

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
