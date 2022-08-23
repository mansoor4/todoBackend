import config from 'config';
import { cloudinaryUploader } from '../serverConfig/cloudinary';
import { CLOUDINARY } from '../types/config';
import errorHandler from './errorHandler';

const { CLOUDINARY_FOLDER_NAME } = config.get('CLOUDINARY') as CLOUDINARY;

const deleteCloudinaryImage = (fileName: string):
    Promise<Boolean> => new Promise<Boolean>((resolve, reject) => {
        cloudinaryUploader.destroy(`${CLOUDINARY_FOLDER_NAME}/${fileName}`, {}, (err, res) => {
            const { result } = res;
            if (err || result === 'not found') return reject(errorHandler('Not able to delete the file', 500));
            return resolve(true);
        });
    });
export default deleteCloudinaryImage;
