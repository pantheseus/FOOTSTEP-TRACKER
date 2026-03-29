import * as reminderService from '../services/reminder.service.js';
export const createReminder = async (req, res) => {
    try {
        const userId = req.user?.userId;
        const { reminderTime } = req.body;
        if (!userId)
            return res.status(401).json({ status: 'error', message: 'Unauthorized' });
        if (!reminderTime)
            return res.status(400).json({ status: 'error', message: 'reminderTime is required' });
        const reminder = await reminderService.createReminder(userId, reminderTime);
        res.status(201).json({
            status: 'success',
            data: reminder,
            message: 'Reminder created successfully'
        });
    }
    catch (error) {
        res.status(500).json({ status: 'error', message: error.message });
    }
};
export const getReminders = async (req, res) => {
    try {
        const userId = req.user?.userId;
        if (!userId)
            return res.status(401).json({ status: 'error', message: 'Unauthorized' });
        const reminders = await reminderService.getReminders(userId);
        res.json({
            status: 'success',
            data: reminders,
            message: 'Reminders retrieved successfully'
        });
    }
    catch (error) {
        res.status(500).json({ status: 'error', message: error.message });
    }
};
export const toggleReminder = async (req, res) => {
    try {
        const { reminderId } = req.params;
        const { isActive } = req.body;
        const reminder = await reminderService.toggleReminder(reminderId, isActive);
        res.json({
            status: 'success',
            data: reminder,
            message: `Reminder ${isActive ? 'activated' : 'deactivated'} successfully`
        });
    }
    catch (error) {
        res.status(500).json({ status: 'error', message: error.message });
    }
};
