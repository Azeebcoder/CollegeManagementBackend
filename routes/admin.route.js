import express from 'express';
import { isauthenticated } from '../middleware/auth.middleware.js';
import { isAdmin } from '../middleware/admin.middleware.js';
import { getAllUsers } from '../controllers/admin.controller.js';
const router = express.Router();

router.get('/getAllUsers',isauthenticated,isAdmin,getAllUsers);

export default router;