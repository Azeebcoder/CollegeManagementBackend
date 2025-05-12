import express from 'express'
import { getUserInfo, updateUserInfo } from '../controllers/user.controller.js';
import { isauthenticated } from '../middleware/auth.middleware.js';

const router = express.Router();

router.get('/info',isauthenticated,getUserInfo)
router.put('/update-profile',isauthenticated,updateUserInfo)

export default router;