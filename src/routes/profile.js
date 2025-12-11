import {Router} from 'express';
import { createProfile, getProfile, updateProfile } from '../controllers/customerProfile.js';
import { checkAccessToken } from '../middlewares/checkAccesstoken.js';

const router = Router();

router.post('/',checkAccessToken ,createProfile);

router.get('/',checkAccessToken, getProfile)

router.put('/', checkAccessToken, updateProfile)

export default router;
