import { Router } from 'express';
import * as userController from '../controllers/user.controller.js';
import { authenticateToken } from '../../../middleware/auth.js';

const router = Router();

// Auth routes
router.post('/signup', userController.signup);
router.post('/login', userController.login);

// Profile routes
router.get('/profile', authenticateToken, userController.getProfile);
router.put('/profile', authenticateToken, userController.updateProfile);
router.post('/change-password', authenticateToken, userController.changePassword);
router.delete('/', authenticateToken, userController.deleteAccount);

export default router;
