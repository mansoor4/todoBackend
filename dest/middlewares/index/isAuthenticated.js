"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
var config_1 = __importDefault(require("config"));
var errorHandler_1 = __importDefault(require("../../utils/errorHandler"));
var isAuthenticated = function (req, res, next) {
    var SERVER_JWT_SECRET_KEY = config_1.default.get('SERVER').SERVER_JWT_SECRET_KEY;
    try {
        var authHeader = req.headers.authorization;
        if (!authHeader)
            throw (0, errorHandler_1.default)('You are not authenticated', 401);
        var type = authHeader.split(' ')[0];
        var token = authHeader.split(' ')[1];
        if (!token || type !== 'Bearer')
            throw (0, errorHandler_1.default)('You are not authenticated', 401);
        var result = jsonwebtoken_1.default.verify(token, SERVER_JWT_SECRET_KEY);
        if (!result)
            throw (0, errorHandler_1.default)('You are not authenticated', 401);
        var userId = result.userId;
        res.locals.userId = userId;
        return next();
    }
    catch (err) {
        return next(err);
    }
};
exports.default = isAuthenticated;
