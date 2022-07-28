import cloudinary from '../serverConfig/cloudinary';
import errorHandler from './errorHandler';

const deleteCloudinaryImage = (fileName: string):
    Promise<Boolean> => new Promise<Boolean>((resolve, reject) => {
        cloudinary.destroy(fileName, {}, (err) => {
            if (err) return reject(errorHandler('Not able to delete the file', 500));
            return resolve(true);
        });
    });
export default deleteCloudinaryImage;
