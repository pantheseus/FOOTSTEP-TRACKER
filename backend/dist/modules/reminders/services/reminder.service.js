import prisma from '../../../config/db.js';
export const createReminder = async (userId, reminderTime) => {
    return await prisma.reminder.create({
        data: {
            user_id: userId,
            reminder_time: reminderTime
        }
    });
};
export const getReminders = async (userId) => {
    return await prisma.reminder.findMany({
        where: { user_id: userId, is_active: true }
    });
};
export const toggleReminder = async (reminderId, isActive) => {
    return await prisma.reminder.update({
        where: { reminder_id: reminderId },
        data: { is_active: isActive }
    });
};
