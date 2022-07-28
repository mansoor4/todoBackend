import { validationResult } from 'express-validator';
import { RequestHandler } from 'express';
import errorHandler from '../../utils/errorHandler';
import deleteCloudinaryImage from '../../utils/deleteCloudinaryImage';

const validationError: RequestHandler = async (req, _, next) => {
    try {
        const error = validationResult(req).array();
        if (error.length > 0) {
            const fileName = req.file?.filename;
            if (fileName) await deleteCloudinaryImage(fileName);
            throw errorHandler(error[0].msg, 400);
        }
        return next();
    } catch (err) {
        return next(err);
    }
};

export default validationError;
