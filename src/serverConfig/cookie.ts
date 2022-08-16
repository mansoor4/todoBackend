import config from 'config';
import { CookieOptions } from 'express';
import { SERVER } from '../types/config';

const { SERVER_SECURE } = config.get('SERVER') as SERVER;

const getCookieConfig = (expireTime: number): CookieOptions => ({
    httpOnly: true,
    secure: SERVER_SECURE,
    maxAge: expireTime,
    sameSite: SERVER_SECURE ? 'none' : 'strict',
});

export default getCookieConfig;
