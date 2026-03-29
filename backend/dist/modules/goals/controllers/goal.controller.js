import * as goalService from '../services/goal.service.js';
export const setGoal = async (req, res) => {
    try {
        const userId = req.user?.userId;
        const { dailyGoal } = req.body;
        if (!userId)
            return res.status(401).json({ status: 'error', message: 'Unauthorized' });
        if (!dailyGoal)
            return res.status(400).json({ status: 'error', message: 'dailyGoal is required' });
        const goal = await goalService.createOrUpdateGoal(userId, dailyGoal);
        res.json({
            status: 'success',
            data: goal,
            message: 'Goal set successfully'
        });
    }
    catch (error) {
        res.status(500).json({ status: 'error', message: error.message });
    }
};
export const getGoal = async (req, res) => {
    try {
        const userId = req.user?.userId;
        if (!userId)
            return res.status(401).json({ status: 'error', message: 'Unauthorized' });
        const goal = await goalService.getLatestGoal(userId);
        res.json({
            status: 'success',
            data: goal || { daily_goal: 5000 }, // Default goal if none set
            message: 'Goal retrieved successfully'
        });
    }
    catch (error) {
        res.status(500).json({ status: 'error', message: error.message });
    }
};
