import { Response } from 'express';
import { AuthRequest } from '../../../middleware/auth.js';
import * as stepService from '../services/step.service.js';

export const updateSteps = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.userId;
    const { date, stepCount } = req.body;

    if (!userId) return res.status(401).json({ status: 'error', message: 'Unauthorized' });
    if (!date || stepCount === undefined) {
      return res.status(400).json({ status: 'error', message: 'Date and stepCount are required' });
    }

    const steps = await stepService.updateSteps(userId, date, stepCount);

    res.json({
      status: 'success',
      data: steps,
      message: 'Steps updated successfully'
    });
  } catch (error: any) {
    res.status(500).json({ status: 'error', message: error.message });
  }
};

export const getStepsToday = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.userId;
    if (!userId) return res.status(401).json({ status: 'error', message: 'Unauthorized' });

    const steps = await stepService.getStepsToday(userId);

    res.json({
      status: 'success',
      data: steps || { step_count: 0 },
      message: 'Steps retrieved successfully'
    });
  } catch (error: any) {
    res.status(500).json({ status: 'error', message: error.message });
  }
};

export const getStepHistory = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.userId;
    if (!userId) return res.status(401).json({ status: 'error', message: 'Unauthorized' });

    const history = await stepService.getStepHistory(userId);

    res.json({
      status: 'success',
      data: history,
      message: 'Step history retrieved successfully'
    });
  } catch (error: any) {
    res.status(500).json({ status: 'error', message: error.message });
  }
};
