import NextI18Next from 'next-i18next';
import { Handler } from 'express';

declare function nextI18NextMiddleware(nexti18next: NextI18Next): Handler[];

export default nextI18NextMiddleware;
