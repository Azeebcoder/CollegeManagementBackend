import express from 'express';
import { isauthenticated } from '../middleware/auth.middleware.js';
import { isAdmin } from '../middleware/admin.middleware.js';
import { getAllUsers, getOneUser,deleteUser, authentacitedAdmin } from '../controllers/admin.controller.js';
const router = express.Router();

router.get('/get-all-users',isauthenticated,isAdmin,getAllUsers);
router.get('/isauthenticated-admin',isauthenticated,isAdmin,authentacitedAdmin);
router.get('/get-one-user/:userId',isauthenticated,isAdmin,getOneUser);
router.delete('/delete-user/:userId',isauthenticated,isAdmin,deleteUser);

export default router;