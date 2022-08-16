"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var config_1 = __importDefault(require("config"));
var jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
var generateToken = function (userId, expiresIn) {
    var SERVER_JWT_SECRET_KEY = config_1.default.get('SERVER').SERVER_JWT_SECRET_KEY;
    return jsonwebtoken_1.default.sign({ userId: userId }, SERVER_JWT_SECRET_KEY, { expiresIn: expiresIn });
};
exports.default = generateToken;
