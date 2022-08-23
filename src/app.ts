/* eslint-disable @typescript-eslint/no-unused-vars */
import express, { NextFunction, Request, Response } from 'express';
import dns from 'dns';
import config from 'config';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import StatusError from './class/statusError';
import { SERVER } from './types/config';
import errorHandler from './utils/errorHandler';

/* Routes Export */
import userRouter from './routes/user';
import todoRouter from './routes/todo';
import authRouter from './routes/auth';

/* Config */
const { SERVER_CLIENT_URL } = config.get('SERVER') as SERVER;

/* Express App */
const app = express();

/* Check internet connectivity */
app.use(async (req: Request, res: Response, next: NextFunction) => {
    try {
        await dns.promises.lookup('google.com');
        return next();
    } catch (err) {
        return next(err);
    }
});

/* Middleware */
app.set('trust proxy', 1);
app.use(express.json());
app.use(cors({
    credentials: true,
    origin: SERVER_CLIENT_URL,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'UPDATE'],
    allowedHeaders: ['X-Requested-With', 'X-HTTP-Method-Override', 'Content-Type', 'Accept', 'Authorization'],
}));

app.use(cookieParser());

/* Routes */
app.use('/user', userRouter);
app.use('/todo', todoRouter);
app.use('/auth', authRouter);
app.use('/', (req: Request, res: Response, next: NextFunction) => next(errorHandler('Invalid route', 400)));

/* Error Handler */
app.use((err: StatusError, req: Request, res: Response, next: NextFunction) => res
    .status(err.status || 500).json({
        message: err.message,
    }));

export default app;
