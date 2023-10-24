export const toggleZammad = () => {
    const zammad: HTMLDivElement | null = document.querySelector(
        '.zammad-chat'
    );
    const zammadToggle: HTMLDivElement | null = document.querySelector(
        '.zammad-chat-header-controls.js-chat-toggle'
    );
    const zammadIsOpenes: HTMLDivElement | null = document.querySelector(
        '.zammad-chat-is-shown'
    );
    if (zammad && zammadToggle && zammadToggle.click) {
        zammadToggle.click();
        if (!zammadIsOpenes) {
            zammad.style.zIndex = '5000';
        } else {
            zammad.style.zIndex = '1';
        }
    }
};
