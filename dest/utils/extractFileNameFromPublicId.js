"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var extractFileNameFromPublicId = function (publicId) { return publicId.split('/')[1].split('_')[2]; };
exports.default = extractFileNameFromPublicId;
