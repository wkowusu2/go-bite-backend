import { Router } from "express";
import { sendOtp, verifyOtp } from "../controllers/otp.js";

const router = Router()

router.post('/generate-otp', sendOtp)

router.post('/verify-otp', verifyOtp)

export default router;