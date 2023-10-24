import { OrdersResponseDto } from 'swagger/client';

export interface IProfileModalVerifyDeleteAccount {
    isOpen: boolean;
    orders: OrdersResponseDto[];
    setFailedByOrders: (value: boolean) => void;
    setIsOpen: (value: boolean) => void;
    setOpenSuccessModal: (value: boolean) => void;
    setOpenFailedModal: (value: boolean) => void;
    setInputPhone: (value: string) => void;
}
