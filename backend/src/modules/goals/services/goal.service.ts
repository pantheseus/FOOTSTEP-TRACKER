import prisma from '../../../config/db.js';

export const createOrUpdateGoal = async (userId: string, dailyGoal: number) => {
  // Simple logic for MVP: just create a new goal entry or find the latest one
  // Typically we'd have one active goal, but the requirement just says "Set a daily step goal"
  // We'll update if exists for today or create new
  return await prisma.goal.create({
    data: {
      user_id: userId,
      daily_goal: dailyGoal
    }
  });
};

export const getLatestGoal = async (userId: string) => {
  return await prisma.goal.findFirst({
    where: { user_id: userId },
    orderBy: { created_at: 'desc' }
  });
};
