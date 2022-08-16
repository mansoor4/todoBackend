import config from 'config';
import { CookieOptions } from 'express';
import { SERVER } from '../types/config';

const { SERVER_SECURE, SERVER_CLIENT_DOMAIN } = config.get('SERVER') as SERVER;

const getCookieConfig = (expireTime: number): CookieOptions => ({
    httpOnly: true,
    secure: SERVER_SECURE,
    maxAge: expireTime,
    sameSite: SERVER_SECURE ? 'strict' : 'strict',
    domain: SERVER_SECURE ? SERVER_CLIENT_DOMAIN : 'localhost',
});

export default getCookieConfig;
