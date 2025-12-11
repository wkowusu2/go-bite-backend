import {Router} from 'express';
import { createProfile, getProfile, updateCustomerPushToken, updateCutomerAvatar, updateProfile } from '../controllers/customerProfile.js';
import { checkAccessToken } from '../middlewares/checkAccesstoken.js';

const router = Router();

router.post('/',checkAccessToken ,createProfile);

router.get('/',checkAccessToken, getProfile);

router.put('/', checkAccessToken, updateProfile);

router.patch('/push-token', checkAccessToken, updateCustomerPushToken)

router.patch('/avatar-url', checkAccessToken, updateCutomerAvatar)


export default router;
