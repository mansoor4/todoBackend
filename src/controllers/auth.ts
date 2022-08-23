import { RequestHandler } from 'express';
import { QueryArrayResult } from 'pg';
import crypto from 'crypto';
import db from '../db';
import errorHandler from '../utils/errorHandler';
import deleteCloudinaryImage from '../utils/deleteCloudinaryImage';
import googleClient from '../serverConfig/googleClient';
import getCookieConfig from '../serverConfig/cookie';
import generateToken from '../utils/generateToken';

export const signup: RequestHandler = async (req, res, next) => {
    const {
        firstName, lastName, contact, address, email, username, password,
    } = req.body as { [param: string]: string };
    const { imageUrl } = res.locals;
    const fileName = req.file?.filename;
    const imageName = req.file?.originalname;

    const dataBegin = {
        text: 'BEGIN',
        values: [],
    };

    const data1 = {
        text: 'INSERT INTO user_account (first_name,last_name,username,email,contact,address,password,salt) VALUES ($1,$2,$3,$4,$5,$6,$7,$8) RETURNING user_id',
        values: [firstName, lastName, username, email, contact, address],
    };

    const data2 = {
        text: 'INSERT INTO image (name,url,file_name,user_id) VALUES ($1,$2,$3,$4) RETURNING *',
        values: [imageName, imageUrl, fileName],
    };

    const dataCommit = {
        text: 'COMMIT',
        values: [],
    };

    const dataRollback = {
        text: 'ROLLBACK',
        values: [],
    };

    const salt = crypto.randomBytes(16).toString('hex');
    const hash = crypto.pbkdf2Sync(password, salt, 1000, 64, 'sha512').toString('hex');
    try {
        await db.query(dataBegin);
        const result1: QueryArrayResult = await db.query(
            {
                ...data1, values: [...data1.values, hash, salt],
            },
        );
        if (result1.rowCount === 0) throw errorHandler('Not able to register,Try again later', 400);
        const { user_id: userId } = result1.rows[0] as any;
        const result2: QueryArrayResult = await db.query(
            {
                ...data2, values: [...data2.values, userId],
            },
        );
        if (result2.rowCount === 0) throw errorHandler('Image not uploaded', 400);
        await db.query(dataCommit);
        return res.json({
            message: 'Register successfully',
        });
    } catch (err) {
        try {
            await db.query(dataRollback);
            if (fileName) await deleteCloudinaryImage(fileName);
            return next(err);
        } catch (innerErr) {
            return next(innerErr);
        }
    }
};

export const signin: RequestHandler = (req, res, next) => {
    const { user, profile } = req.body;
    const { userId } = user;
    try {
        const token = generateToken(userId, 60 * 60);
        return res
            .cookie('token', token, getCookieConfig(1000 * 60 * 60))
            .json({
                message: 'Signin successfully',
                user,
                profile,
                userId,
                token,
            });
    } catch (err) {
        return next(err);
    }
};

export const logout: RequestHandler = (req, res) => res
    .clearCookie('token')
    .json({ message: 'logout successfully' });


export const getGoogleLoginUrl: RequestHandler = (req, res) => {
    const url = googleClient.generateAuthUrl({
        // eslint-disable-next-line camelcase
        access_type: 'offline',
        scope: [
            'https://www.googleapis.com/auth/userinfo.profile',
            'https://www.googleapis.com/auth/userinfo.email',
        ],
        prompt: 'consent',
    });
    return res.json(url);
};

export const verifyUser: RequestHandler = async (req, res, next) => {
    const code = req.body.code as string;
    try {
        const resToken = await googleClient.getToken(code);
        const { tokens: { id_token: idToken } } = resToken;
        if (!idToken) throw errorHandler('Google login failed', 500);

        const resProfile = await googleClient.verifyIdToken({ idToken });
        const { email } = resProfile.getPayload() || {};
        const data = {
            text: 'SELECT * FROM user_account INNER JOIN image USING(user_id) WHERE email=$1',
            values: [email],
        };
        const result: QueryArrayResult = await db.query(data);
        if (result.rowCount === 0) throw errorHandler('You have not register,Please register', 400);
        const {
            user_id: userId,
            first_name: firstName,
            last_name: lastName,
            username,
            contact,
            address,
            created_at: createdAt,
            updated_at: updatedAt,
            name,
            url,
            file_name: fileName,
        } = result.rows[0] as any;

        const user = {
            userId,
            firstName,
            lastName,
            username,
            email,
            contact,
            address,
            createdAt,
            updatedAt,
        };
        const profile = url ? {
            name,
            url,
            fileName,
        } : undefined;

        const token = generateToken(userId, 60 * 60);
        return res
            .cookie('token', token, getCookieConfig(1000 * 60 * 60))
            .json({
                message: 'Signin successfully',
                user,
                profile,
                userId,
                token,
            });
    } catch (err) {
        return next(err);
    }
};

export const refreshToken: RequestHandler = (req, res, next) => {
    const { userId } = req.body;
    try {
        const token = generateToken(userId, 60 * 60);
        return res
            .cookie('token', token, getCookieConfig(1000 * 60 * 60))
            .json({ token });
    } catch (err) {
        return next(err);
    }
};
