import express from 'express'
import { getUserInfo } from '../controllers/user.controller.js';
import { isauthenticated } from '../middleware/auth.middleware.js';

const router = express.Router();

router.get('/info',isauthenticated,getUserInfo)

export default router;