"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var config_1 = __importDefault(require("config"));
var cloudinary_1 = require("../serverConfig/cloudinary");
var errorHandler_1 = __importDefault(require("./errorHandler"));
var CLOUDINARY_FOLDER_NAME = config_1.default.get('CLOUDINARY').CLOUDINARY_FOLDER_NAME;
var deleteCloudinaryImage = function (fileName) { return new Promise(function (resolve, reject) {
    cloudinary_1.cloudinaryUploader.destroy("".concat(CLOUDINARY_FOLDER_NAME, "/").concat(fileName), {}, function (err, res) {
        var result = res.result;
        if (err || result === 'not found')
            return reject((0, errorHandler_1.default)('Not able to delete the file', 500));
        return resolve(true);
    });
}); };
exports.default = deleteCloudinaryImage;
