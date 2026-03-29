import prisma from '../../../config/db.js';
export const updateSteps = async (userId, date, stepCount) => {
    return await prisma.dailyStep.upsert({
        where: {
            user_id_date: {
                user_id: userId,
                date: new Date(date)
            }
        },
        update: {
            step_count: stepCount
        },
        create: {
            user_id: userId,
            date: new Date(date),
            step_count: stepCount
        }
    });
};
export const getStepsToday = async (userId) => {
    const today = new Date().toISOString().split('T')[0];
    return await prisma.dailyStep.findFirst({
        where: {
            user_id: userId,
            date: new Date(today)
        }
    });
};
export const getStepHistory = async (userId, limit = 7) => {
    return await prisma.dailyStep.findMany({
        where: {
            user_id: userId
        },
        orderBy: {
            date: 'desc'
        },
        take: limit
    });
};
