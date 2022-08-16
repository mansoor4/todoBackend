"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var config_1 = __importDefault(require("config"));
var _a = config_1.default.get('SERVER'), SERVER_SECURE = _a.SERVER_SECURE, SERVER_CLIENT_DOMAIN = _a.SERVER_CLIENT_DOMAIN;
var getCookieConfig = function (expireTime) { return ({
    httpOnly: true,
    secure: SERVER_SECURE,
    maxAge: expireTime,
    sameSite: 'lax',
    domain: SERVER_SECURE ? SERVER_CLIENT_DOMAIN : 'localhost',
}); };
exports.default = getCookieConfig;
