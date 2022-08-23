import config from 'config';
import { cloudinaryApi } from '../../src/serverConfig/cloudinary';
import { CLOUDINARY } from '../../src/types/config';

const { CLOUDINARY_FOLDER_NAME } = config.get('CLOUDINARY') as CLOUDINARY;

const getUploadedImageDetail = (): Promise<any> => new Promise<any>((resolve, reject) => {
    cloudinaryApi.resources({ prefix: CLOUDINARY_FOLDER_NAME, type: 'upload' })
        .then((result) => resolve(result.resources))
        .catch((err) => reject(err));
});

export default getUploadedImageDetail;
