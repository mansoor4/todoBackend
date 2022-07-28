/* eslint-disable camelcase */
import { RequestHandler } from 'express';
// import path from 'path';
import cloudinary from '../../serverConfig/cloudinary';
import deleteLocalImage from '../../utils/deleteLocalImage';

const cloudinaryUpload: RequestHandler = async (req, res, next) => {
    const { file } = req;

    if (!file) {
        res.locals.imageUrl = null;
        return next();
    }

    const fileName = file.filename;
    const filePath = file.path;
    try {
        const result = await cloudinary.upload(filePath, { public_id: fileName });
        res.locals.imageUrl = result.url;
    } catch (err) {
        return next(err);
    }

    try {
        await deleteLocalImage(fileName);
        return next();
    } catch (err) {
        return next(err);
    }
};

export default cloudinaryUpload;
