import { BookingPassenger, BookingState } from 'store/booking/types';
import { UserState } from 'store/user/types';
import { PassengersRequestDto, PersonalDataDto } from 'swagger/client';
import { BookField } from 'components/NewPassenger';
import trim from 'lodash/trim';

export function dateMaskToISO(date: string) {
    const d = date.split('.');

    return `${d[2]}-${d[1]}-${d[0]}`;
}

export function passengersToDTO(
    booking: BookingState,
    user: UserState,
    bookFields: BookField[] = []
): PassengersRequestDto[] {
    const passengers: BookingPassenger[] = Object.values(
        booking.passengers
    ).filter(passenger => passenger !== null) as BookingPassenger[];

    return passengers.map(passenger => ({
        id: passenger.id ? passenger.id : 0,
        birthDate:
            bookFields.includes('birthDate') && passenger.birthDate
                ? dateMaskToISO(passenger.birthDate)
                : undefined,
        dischargeStopId: String(booking.dropoffValue),
        docNumber:
            bookFields.includes('document') && passenger.docNumber
                ? passenger.docNumber.replace(/[- ]/g, '')
                : undefined,
        docTypeCode: passenger.docTypeCode,
        firstName: trim(passenger.firstName),
        genderTypeCode: bookFields.includes('gender')
            ? passenger.genderCode
            : undefined,
        citizenshipCode: bookFields.includes('citizenship')
            ? passenger.citizenshipCode
            : undefined,
        lastName: trim(passenger.lastName),
        middleName: bookFields.includes('patronymic')
            ? trim(passenger.middleName)
            : undefined,
        phone: user.phoneNumber,
        pickupStopId: String(booking.pickupValue),
        seatCode: 0,
        ticketTypeCode: passenger.ticketTypeCode,
        subject: booking.subject,
    }));
}

export function hasDocumentEnoughData(
    document: PersonalDataDto,
    bookFields: BookField[]
) {
    if (bookFields.includes('patronymic') && !document.patronymic) {
        return false;
    }

    if (bookFields.includes('birthDate') && !document.birthday) {
        return false;
    }

    if (
        bookFields.includes('document') &&
        (!document.docNum || !document.docType)
    ) {
        return false;
    }

    if (bookFields.includes('citizenship') && !document.citizen) {
        return false;
    }

    if (bookFields.includes('gender') && !document.gender) {
        return false;
    }

    return true;
}
