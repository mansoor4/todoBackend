"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var config_1 = __importDefault(require("config"));
var SERVER_SECURE = config_1.default.get('SERVER').SERVER_SECURE;
var getCookieConfig = function (expireTime) { return ({
    httpOnly: true,
    secure: SERVER_SECURE,
    maxAge: expireTime,
    sameSite: SERVER_SECURE ? 'none' : 'strict',
}); };
exports.default = getCookieConfig;
