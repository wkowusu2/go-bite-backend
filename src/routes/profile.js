import {Router} from 'express';
import { createProfile, creatingIsGuest, getProfile, gettingIsguest, updateCustomerPushToken, updateCutomerAvatar, updateProfile, updatingIsGuest } from '../controllers/customerProfile.js';
import { checkAccessToken } from '../middlewares/checkAccesstoken.js';

const router = Router();

router.post('/',checkAccessToken ,createProfile);

router.get('/',checkAccessToken, getProfile);

router.put('/', checkAccessToken, updateProfile);

router.patch('/push-token', checkAccessToken, updateCustomerPushToken);

router.patch('/avatar-url', checkAccessToken, updateCutomerAvatar);

router.get('/is-guest', checkAccessToken, gettingIsguest);

router.post('/is-guest', checkAccessToken, creatingIsGuest);

router.patch('/is-guest', checkAccessToken, updatingIsGuest);



export default router;
