"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var config_1 = __importDefault(require("config"));
var app_1 = __importDefault(require("./app"));
var SERVER_PORT = config_1.default.get('SERVER').SERVER_PORT;
/* Server Start */
app_1.default.listen(SERVER_PORT, function () {
    console.log("Server Started at port ".concat(SERVER_PORT));
});
