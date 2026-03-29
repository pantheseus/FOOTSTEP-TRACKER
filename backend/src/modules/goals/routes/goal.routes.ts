import { Router } from 'express';
import * as goalController from '../controllers/goal.controller.js';
import { authenticateToken } from '../../../middleware/auth.js';

const router = Router();

router.use(authenticateToken);

router.post('/', goalController.setGoal);
router.get('/', goalController.getGoal);

export default router;
