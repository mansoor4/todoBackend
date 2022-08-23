/* eslint-disable camelcase */
import cloudinary from 'cloudinary';
import config from 'config';
import { CLOUDINARY } from '../types/config';

const {
    CLOUDINARY_CLOUD_NAME,
    CLOUDINARY_API_KEY,
    CLOUDINARY_API_SECRET,
} = config.get('CLOUDINARY') as CLOUDINARY;

const cloudinaryConfig = cloudinary.v2;

cloudinaryConfig.config({
    cloud_name: CLOUDINARY_CLOUD_NAME,
    api_key: CLOUDINARY_API_KEY,
    api_secret: CLOUDINARY_API_SECRET,
});

export const cloudinaryUploader = cloudinaryConfig.uploader;
export const cloudinaryApi = cloudinaryConfig.api;
