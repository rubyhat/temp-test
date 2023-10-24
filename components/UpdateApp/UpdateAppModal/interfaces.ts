interface IData {
    title: string;
    subtitle: string;
    buttonTitle: string;
    required: boolean;
    link: string;
    isCordova: boolean;
    isMobile: boolean;
}

export interface IUpdateAppModal {
    open: boolean;
    setIsOpen: (value: boolean) => void;
    data: IData;
}
