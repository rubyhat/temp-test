import { CustomWindow } from 'typings/window';

declare let window: CustomWindow;

export const initZammadChat = () => {
    if (window.$) {
        const ZammadChat = window.ZammadChat;
        window.$(function() {
            new ZammadChat({
                fontSize: '14px',
                chatId: 6,
                flat: true,
                debug: false,
                show: false,
            });
        });
    }
};
