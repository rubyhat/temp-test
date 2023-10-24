export interface IProfileModalDeleteAccountFailed {
    isOpen: boolean;
    failedByOrders: boolean;
    setFailedByOrders: (value: boolean) => void;
    setIsOpen: (value: boolean) => void;
    openNextModal: (value: boolean) => void;
    inputPhone: string;
}
