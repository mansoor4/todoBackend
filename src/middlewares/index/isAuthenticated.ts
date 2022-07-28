import { RequestHandler } from 'express';
import jwt, { JwtPayload } from 'jsonwebtoken';
import config from 'config';
import errorHandler from '../../utils/errorHandler';
import { SERVER } from '../../types/config';

const isAuthenticated: RequestHandler = (req, res, next) => {
    const { token } = req.cookies;
    const { SERVER_JWT_SECRET_KEY } = config.get('SERVER') as SERVER;
    try {
        if (!token) throw errorHandler('You are not authenticated', 400);
        const result = jwt.verify(token, SERVER_JWT_SECRET_KEY);
        if (!result) throw errorHandler('You are not authenticated', 400);
        const { userId } = result as JwtPayload;
        res.locals.userId = userId;
        return next();
    } catch (err) {
        return next(err);
    }
};

export default isAuthenticated;
