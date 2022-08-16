import { Router } from 'express';

/* Import Middlewares */
import signupValidation from '../middlewares/auth/signupValidation';
import signinValidation from '../middlewares/auth/signinValidation';
import validationError from '../middlewares/index/validationError';
import upload from '../serverConfig/multer';

/* Import Controllers */
import {
    signup, signin, logout, getGoogleLoginUrl, verifyUser, refreshToken,
} from '../controllers/auth';
import cloudinaryUpload from '../middlewares/index/cloudinaryUpload';

const route = Router();

route.post('/signup', upload.single('profile'), cloudinaryUpload, signupValidation, validationError, signup);
route.post('/signin', signinValidation, validationError, signin);
route.get('/logout', logout);

route.get('/getGoogleLoginUrl', getGoogleLoginUrl);
route.post('/verifyUser', verifyUser);

route.post('/refreshToken', refreshToken);
export default route;
