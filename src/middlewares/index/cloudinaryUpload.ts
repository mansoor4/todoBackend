/* eslint-disable camelcase */
import { RequestHandler } from 'express';
import config from 'config';

// import path from 'path';
import { cloudinaryUploader } from '../../serverConfig/cloudinary';
import deleteLocalImage from '../../utils/deleteLocalImage';
import { CLOUDINARY } from '../../types/config';

const { CLOUDINARY_FOLDER_NAME } = config.get('CLOUDINARY') as CLOUDINARY;

const cloudinaryUpload: RequestHandler = async (req, res, next) => {
    const { file } = req;

    if (!file) {
        res.locals.imageUrl = null;
        return next();
    }

    const fileName = file.filename;
    const filePath = file.path;
    try {
        const result = await cloudinaryUploader.upload(filePath, {
            public_id: fileName, folder: CLOUDINARY_FOLDER_NAME,
        });
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
