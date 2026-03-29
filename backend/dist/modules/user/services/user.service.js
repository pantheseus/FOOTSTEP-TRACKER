import prisma from '../../../config/db.js';
import jwt from 'jsonwebtoken';
const JWT_SECRET = process.env.JWT_SECRET || 'supersecretkey';
export const createUser = async (name, email, password_hash) => {
    return await prisma.user.create({
        data: {
            name,
            email,
            password_hash,
            profile: {
                create: {}
            }
        },
        include: {
            profile: true
        }
    });
};
export const findUserByEmail = async (email) => {
    return await prisma.user.findUnique({
        where: { email },
        include: { profile: true }
    });
};
export const findUserById = async (userId) => {
    return await prisma.user.findUnique({
        where: { user_id: userId },
        include: { profile: true }
    });
};
export const updateProfile = async (userId, age, gender) => {
    return await prisma.userProfile.update({
        where: { user_id: userId },
        data: {
            age,
            gender
        }
    });
};
export const generateToken = (userId, email) => {
    return jwt.sign({ userId, email }, JWT_SECRET, { expiresIn: '7d' });
};
