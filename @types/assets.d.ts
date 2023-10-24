declare module '*.svg' {
    import { ComponentType } from 'react';
    const content: ComponentType<{ className?: string }>;
    export default content;
}

declare module '*.styl' {
    const content: Record<string, string>;
    export default content;
}
