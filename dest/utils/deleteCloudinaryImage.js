"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var cloudinary_1 = __importDefault(require("../serverConfig/cloudinary"));
var errorHandler_1 = __importDefault(require("./errorHandler"));
var deleteCloudinaryImage = function (fileName) { return new Promise(function (resolve, reject) {
    cloudinary_1.default.destroy(fileName, {}, function (err) {
        if (err)
            return reject((0, errorHandler_1.default)('Not able to delete the file', 500));
        return resolve(true);
    });
}); };
exports.default = deleteCloudinaryImage;
