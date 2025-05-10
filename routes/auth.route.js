import express from 'express'
import { registerUser, sendEmailOtp, verifyEmailOtp,loginUser, resetOtpSend, verifyResetOtp, isValidUser, logoutUser} from '../controllers/auth.controller.js';
import { isauthenticated } from '../middleware/auth.middleware.js';

const router = express.Router();

router.post('/register',registerUser);
router.post('/login',loginUser);
router.get('/logout',isauthenticated,logoutUser)
router.get('/send-email',isauthenticated,sendEmailOtp);
router.post('/verify-otp',isauthenticated,verifyEmailOtp);
router.post('/reset-otp-send',isauthenticated,resetOtpSend);
router.post('/verify-reset-otp',isauthenticated,verifyResetOtp);
router.get('/is-authentacited',isauthenticated,isValidUser)

export default router;