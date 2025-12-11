import {Router} from 'express';
import { createProfile, getProfile } from '../controllers/customerProfile.js';
import { checkAccessToken } from '../middlewares/checkAccesstoken.js';

const router = Router();
router.get('/',checkAccessToken, getProfile)

router.post('/', createProfile)

export default router;
