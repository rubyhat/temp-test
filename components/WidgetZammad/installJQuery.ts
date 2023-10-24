export const installJQuery = (setjqIsLoad: (v: boolean) => void) => {
    const jQueryScript = document.createElement('script');
    jQueryScript.src = 'https://code.jquery.com/jquery-3.6.0.min.js';
    jQueryScript.id = 'jquery-min-js';

    document.body.append(jQueryScript);

    jQueryScript.onload = () => setjqIsLoad(true);
    jQueryScript.onerror = () => {
        setjqIsLoad(false);
        console.log('jquery load error');
    };
};
