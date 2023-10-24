type ButtonVariant = 'primary' | 'danger';

interface IButton {
    text: string;
    variant: ButtonVariant;
    onClick?: () => void;
}

export interface IProfileCardWithButton {
    button: IButton;
    cardText: string;
    className?: string;
}
