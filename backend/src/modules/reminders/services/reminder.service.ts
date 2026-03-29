import prisma from '../../../config/db.js';

export const createReminder = async (userId: string, reminderTime: string) => {
  return await prisma.reminder.create({
    data: {
      user_id: userId,
      reminder_time: reminderTime
    }
  });
};

export const getReminders = async (userId: string) => {
  return await prisma.reminder.findMany({
    where: { user_id: userId, is_active: true }
  });
};

export const toggleReminder = async (reminderId: string, isActive: boolean) => {
  return await prisma.reminder.update({
    where: { reminder_id: reminderId },
    data: { is_active: isActive }
  });
};
