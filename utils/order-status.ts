import { OrderDtoStatusEnum } from 'swagger/client';

export function hasFailedStatus(status: OrderDtoStatusEnum) {
    return (
        status === OrderDtoStatusEnum.Cancelled ||
        status === OrderDtoStatusEnum.Expired ||
        status === OrderDtoStatusEnum.Error
    );
}
