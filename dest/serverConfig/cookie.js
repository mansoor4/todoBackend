"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// import { SERVER } from '../types/config';
// const { SERVER_SECURE, SERVER_CLIENT_DOMAIN } = config.get('SERVER') as SERVER;
var getCookieConfig = function (expireTime) { return ({
    httpOnly: true,
    secure: false,
    maxAge: expireTime,
    sameSite: 'strict',
    // domain: SERVER_SECURE ? SERVER_CLIENT_DOMAIN : 'localhost',
}); };
exports.default = getCookieConfig;
