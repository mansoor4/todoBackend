"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var config_1 = __importDefault(require("config"));
var app_1 = __importDefault(require("./app"));
var _a = config_1.default.get('SERVER'), SERVER_PORT = _a.SERVER_PORT, SERVER_SECURE = _a.SERVER_SECURE;
/* Server Start */
app_1.default.listen(SERVER_PORT, function () {
    console.log("Server Started at port ".concat(SERVER_PORT));
    console.log(SERVER_SECURE);
});
