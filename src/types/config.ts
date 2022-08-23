import { Secret } from 'jsonwebtoken';

export type DB = {
    DB_DATABASE: string,
    DB_USER: string,
    DB_PASSWORD: string,
    DB_HOST: string,
    DB_PORT: number
};

export type SERVER = {
    SERVER_PORT: number,
    SERVER_JWT_SECRET_KEY: Secret,
    SERVER_CLIENT_URL: string,
    SERVER_CLIENT_DOMAIN: string,
    SERVER_SECURE: boolean,
};

export type GOOGLE = {
    GOOGLE_CLIENT_ID: string,
    GOOGLE_SECRET: string,
    GOOGLE_REDIRECT: string
}

export type CLOUDINARY = {
    CLOUDINARY_CLOUD_NAME: string,
    CLOUDINARY_API_KEY: string,
    CLOUDINARY_API_SECRET: string,
    CLOUDINARY_FOLDER_NAME: string,
}
