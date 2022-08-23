"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.cloudinaryApi = exports.cloudinaryUploader = void 0;
/* eslint-disable camelcase */
var cloudinary_1 = __importDefault(require("cloudinary"));
var config_1 = __importDefault(require("config"));
var _a = config_1.default.get('CLOUDINARY'), CLOUDINARY_CLOUD_NAME = _a.CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY = _a.CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET = _a.CLOUDINARY_API_SECRET;
var cloudinaryConfig = cloudinary_1.default.v2;
cloudinaryConfig.config({
    cloud_name: CLOUDINARY_CLOUD_NAME,
    api_key: CLOUDINARY_API_KEY,
    api_secret: CLOUDINARY_API_SECRET,
});
exports.cloudinaryUploader = cloudinaryConfig.uploader;
exports.cloudinaryApi = cloudinaryConfig.api;
