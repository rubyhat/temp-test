import { isNumeric } from './isNumeric';

const parseValue = (s: string): number => {
    s = s.replace(/\D/g, '');
    const number = parseInt(s, 10);

    if (isNumeric(number)) return number;

    return 0;
};

const getPropertyValue = (prop: string) => {
    if (process.browser && getComputedStyle && document) {
        return parseValue(
            getComputedStyle(document.documentElement).getPropertyValue(prop)
        );
    } else {
        return 0;
    }
};

export const getSafeArea = () => ({
    top: getPropertyValue('--sat'),
    bottom: getPropertyValue('--sab'),
    left: getPropertyValue('--sal'),
    right: getPropertyValue('--sar'),
});
