import { useEffect, useRef, useState } from 'react';
import parseISO from 'date-fns/parseISO';

import { PersonalDataDto } from 'swagger/client';
import { format } from 'utils/date';

type Props<F> = {
    formik: F;
    documents: PersonalDataDto[];
    onClose: () => void;
    open: boolean;
};

export function setFormikValues<F extends any>(
    formik: F,
    doc: PersonalDataDto
) {
    formik.setFieldValue('id', doc.id || 0);
    formik.setFieldValue('firstName', doc.name);
    formik.setFieldValue('lastName', doc.surname);
    formik.setFieldValue('middleName', doc.patronymic || '');
    formik.setFieldValue('docNumber', doc.docNum || '');
    formik.setFieldValue(
        'birthDate',
        doc.birthday ? format(parseISO(doc.birthday), 'dd.MM.yyyy') : ''
    );

    if (doc.gender) formik.setFieldValue('genderCode', doc.gender);
    if (doc.docType) formik.setFieldValue('docTypeCode', doc.docType);
    if (doc.citizen) formik.setFieldValue('citizenshipCode', doc.citizen);
}

export function useSavedPassengers<F extends any>(props: Props<F>) {
    const { formik, documents, onClose, open } = props;

    const [openSavedPassengers, setOpenSavedPassengers] = useState(false);
    const shouldSubmitForm = useRef<boolean>(false);
    useEffect(() => {
        if (open) {
            setOpenSavedPassengers(documents.length > 0);
        }
    }, [documents.length, open]);
    const handleSavedPassengersClose = () => {
        setOpenSavedPassengers(false);
        onClose();
    };
    const handleNewPassenger = () => {
        setOpenSavedPassengers(false);
    };
    const handleSelectPassenger = (doc: PersonalDataDto) => {
        setOpenSavedPassengers(false);
        setFormikValues<F>(formik, doc);
        shouldSubmitForm.current = true;
    };
    useEffect(() => {
        if (shouldSubmitForm.current) {
            formik.submitForm();
        }

        shouldSubmitForm.current = false;
    }, [shouldSubmitForm.current]);

    return {
        openSavedPassengers,
        handleSavedPassengersClose,
        handleNewPassenger,
        handleSelectPassenger,
    };
}
