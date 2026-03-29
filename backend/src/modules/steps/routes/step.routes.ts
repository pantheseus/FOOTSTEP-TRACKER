import { Router } from 'express';
import * as stepController from '../controllers/step.controller.js';
import { authenticateToken } from '../../../middleware/auth.js';

const router = Router();

router.use(authenticateToken);

router.post('/', stepController.updateSteps);
router.get('/today', stepController.getStepsToday);
router.get('/history', stepController.getStepHistory);

export default router;
