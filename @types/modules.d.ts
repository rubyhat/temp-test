declare module 'nano-bem' {
    function Block(
        elem: string,
        mods?: Record<string, string | number | boolean>
    ): string;
    function Block(mods?: Record<string, string | number | boolean>): string;
    const block = (name: string, map?: Record<string, string>) => Block;
    const mix = (...strings: (string | undefined)[]) => string;

    export const block;
    export const mix;
}

declare module 'react-scrolllock' {
    import { ComponentType, ReactNode } from 'react';
    const ScrollLock: ComponentType<{ children: ReactNode }>;
    const TouchScrollable: ComponentType<{ children: ReactNode }>;
    export default ScrollLock;
    export const TouchScrollable;
}
