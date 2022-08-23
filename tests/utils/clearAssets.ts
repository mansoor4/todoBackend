import config from 'config';
import { cloudinaryApi } from '../../src/serverConfig/cloudinary';
import { CLOUDINARY } from '../../src/types/config';

const { CLOUDINARY_FOLDER_NAME } = config.get('CLOUDINARY') as CLOUDINARY;

const clearAssets = (): Promise<Boolean> => new Promise<Boolean>((resolve, reject) => {
    cloudinaryApi.delete_resources_by_prefix(CLOUDINARY_FOLDER_NAME)
        .then(() => resolve(true))
        .catch((err) => reject(err));
});


export default clearAssets;
