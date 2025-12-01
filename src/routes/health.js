import {Router} from 'express';
import {home, health } from '../controllers/availabilityChecks.js'

const router = Router();
router.get('/', home )

router.get("/health", health)

export default router;
