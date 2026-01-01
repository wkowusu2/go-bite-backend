import {Router} from 'express';
import {home, health, pingDb } from '../controllers/availabilityChecks.js'

const router = Router();
router.get('/', home )

router.get("/health", health)

router.get('/ping-db', pingDb)

export default router;
