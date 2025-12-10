import { Router } from "express";
import { refreshingToken, sendOtp, verifyOtp } from "../controllers/otp.js";

const router = Router()

router.post('/generate-otp', sendOtp);

router.post('/verify-otp', verifyOtp);

router.post('/refresh', refreshingToken);

export default router;