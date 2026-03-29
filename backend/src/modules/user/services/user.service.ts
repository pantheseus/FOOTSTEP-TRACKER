import prisma from '../../../config/db.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'supersecretkey';

export const createUser = async (name: string, email: string, password_hash: string) => {
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

export const findUserByEmail = async (email: string) => {
  return await prisma.user.findUnique({
    where: { email },
    include: { profile: true }
  });
};

export const findUserById = async (userId: string) => {
  return await prisma.user.findUnique({
    where: { user_id: userId },
    include: { profile: true }
  });
};

export const updateProfile = async (userId: string, age?: number, gender?: string) => {
  return await prisma.userProfile.update({
    where: { user_id: userId },
    data: {
      age,
      gender
    }
  });
};

export const generateToken = (userId: string, email: string) => {
  return jwt.sign({ userId, email }, JWT_SECRET, { expiresIn: '7d' });
};
