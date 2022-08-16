"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = __importDefault(require("express"));
var config_1 = __importDefault(require("config"));
var cors_1 = __importDefault(require("cors"));
var cookie_parser_1 = __importDefault(require("cookie-parser"));
/* Routes Export */
var user_1 = __importDefault(require("./routes/user"));
var todo_1 = __importDefault(require("./routes/todo"));
var auth_1 = __importDefault(require("./routes/auth"));
var errorHandler_1 = __importDefault(require("./utils/errorHandler"));
/* Config */
var _a = config_1.default.get('SERVER'), SERVER_PORT = _a.SERVER_PORT, SERVER_CLIENT_URL = _a.SERVER_CLIENT_URL;
/* Express App */
var app = (0, express_1.default)();
/* Middleware */
app.set('trust proxy', 1);
app.use(express_1.default.json());
app.use((0, cors_1.default)({
    credentials: true,
    origin: SERVER_CLIENT_URL,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'UPDATE'],
    allowedHeaders: ['X-Requested-With', 'X-HTTP-Method-Override', 'Content-Type', 'Accept'],
}));
app.use((0, cookie_parser_1.default)());
/* Routes */
app.use('/user', user_1.default);
app.use('/todo', todo_1.default);
app.use('/auth', auth_1.default);
app.use('/', function (req, res, next) { return next((0, errorHandler_1.default)('Invalid route', 400)); });
/* Error Handler */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
app.use(function (err, req, res, next) { return res
    .status(err.status || 500).json({
    message: err.message,
}); });
/* Server Start */
app.listen(SERVER_PORT, function () {
    console.log("Server Started at port ".concat(SERVER_PORT));
});
