import { initZammadChat } from 'components/WidgetZammad/initZammadChat';
import { Dispatch } from 'redux';
import { zammadChatIsLoad } from 'store/feedbackWidget/actions';

export const installZammadChat = (
    jqisLoad: boolean,
    dispatch: Dispatch<any>,
    isCompasBus: boolean
) => {
    const zammadInitScript = document.createElement('script');
    zammadInitScript.id = 'zammad_chat_script';
    zammadInitScript.src = isCompasBus
        ? 'https://zammad.compasbus.pl/assets/chat/chat.min.js'
        : 'https://zammad.atlasteam.me/assets/chat/chat.min.js';
    document.body.append(zammadInitScript);

    zammadInitScript.onload = () => {
        initZammadChat();
        dispatch(zammadChatIsLoad(true));
    };

    zammadInitScript.onerror = () => dispatch(zammadChatIsLoad(false));
};
