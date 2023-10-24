import { IncomingMessage } from 'http';

export function getRealIP(req: IncomingMessage): string | undefined {
    return (
        (req.headers['x-forwarded-for'] as string) ||
        req.connection.remoteAddress
    );
}
