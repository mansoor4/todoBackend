import { RequestHandler } from 'express';
import jwt, { JwtPayload } from 'jsonwebtoken';
import config from 'config';
import errorHandler from '../../utils/errorHandler';
import { SERVER } from '../../types/config';

const isAuthenticated: RequestHandler = (req, res, next) => {
    const { SERVER_JWT_SECRET_KEY } = config.get('SERVER') as SERVER;
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader) throw errorHandler('You are not authenticated', 401);
        const type = authHeader.split(' ')[0];
        const token = authHeader.split(' ')[1];
        if (!token || type !== 'Bearer') throw errorHandler('You are not authenticated', 401);
        const result = jwt.verify(token, SERVER_JWT_SECRET_KEY);
        if (!result) throw errorHandler('You are not authenticated', 401);
        const { userId } = result as JwtPayload;
        res.locals.userId = userId;
        return next();
    } catch (err) {
        return next(err);
    }
};

export default isAuthenticated;
