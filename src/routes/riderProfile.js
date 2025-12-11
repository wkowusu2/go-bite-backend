import {Router} from 'express';

import { checkAccessToken } from '../middlewares/checkAccesstoken.js';
import { createRiderProfile, getRiderProfile, updateRiderProfile } from '../controllers/riderProfile.js';

const router = Router();

router.post('/',checkAccessToken ,createRiderProfile);

router.get('/',checkAccessToken, getRiderProfile)

router.put('/', checkAccessToken, updateRiderProfile)

export default router;
