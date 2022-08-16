import express, { NextFunction, Request, Response } from 'express';
import config from 'config';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import StatusError from './class/statusError';
import { SERVER } from './types/config';

/* Routes Export */
import userRouter from './routes/user';
import todoRouter from './routes/todo';
import authRouter from './routes/auth';
import errorHandler from './utils/errorHandler';

/* Config */
const { SERVER_PORT, SERVER_CLIENT_URL } = config.get('SERVER') as SERVER;

/* Express App */
const app = express();

/* Middleware */
app.use(express.json());
app.use(cors({
    credentials: true,
    origin: SERVER_CLIENT_URL,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'UPDATE'],
    allowedHeaders: ['X-Requested-With', 'X-HTTP-Method-Override', 'Content-Type', 'Accept'],
}));
app.use(cookieParser());

/* Routes */
app.use('/user', userRouter);
app.use('/todo', todoRouter);
app.use('/auth', authRouter);
app.use('/', (req: Request, res: Response, next: NextFunction) => next(errorHandler('Invalid route', 400)));

/* Error Handler */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
app.use((err: StatusError, req: Request, res: Response, next: NextFunction) => res
    .status(err.status || 500).json({
        message: err.message,
    }));

/* Server Start */
app.listen(SERVER_PORT, () => {
    console.log(`Server Started at port ${SERVER_PORT}`);
});
