import config from 'config';
import jwt from 'jsonwebtoken';
import { SERVER } from '../types/config';

const generateToken = (userId: string, expiresIn: number): string => {
    const { SERVER_JWT_SECRET_KEY } = config.get('SERVER') as SERVER;
    return jwt.sign({ userId }, SERVER_JWT_SECRET_KEY, { expiresIn });
};

export default generateToken;
