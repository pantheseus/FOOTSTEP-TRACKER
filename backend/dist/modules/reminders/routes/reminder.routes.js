import { Router } from 'express';
import * as reminderController from '../controllers/reminder.controller.js';
import { authenticateToken } from '../../../middleware/auth.js';
const router = Router();
router.use(authenticateToken);
router.post('/', reminderController.createReminder);
router.get('/', reminderController.getReminders);
router.patch('/:reminderId/toggle', reminderController.toggleReminder);
export default router;
