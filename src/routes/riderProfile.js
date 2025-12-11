import {Router} from 'express';

import { checkAccessToken } from '../middlewares/checkAccesstoken.js';
import { createRiderProfile, getRiderProfile, updateRiderAvatar, updateRiderOnlineStatus, updateRiderProfile, updateRiderPushToken } from '../controllers/riderProfile.js';

const router = Router();

router.post('/',checkAccessToken ,createRiderProfile);

router.get('/',checkAccessToken, getRiderProfile)

router.put('/', checkAccessToken, updateRiderProfile)

router.patch('/push-token', checkAccessToken, updateRiderPushToken)

router.patch('/avatar-url', checkAccessToken, updateRiderAvatar)

router.patch('/online-status', checkAccessToken, updateRiderOnlineStatus)

export default router;
