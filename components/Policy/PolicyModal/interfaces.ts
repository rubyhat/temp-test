export interface IPolicyModal {
    open: boolean;
    setIsOpen: (value: boolean) => void;
    data: IPolicyData;
}

interface IPolicyData {
    title: string;
    subtitle: string;
    docUrl: string;
    version: string;
}
