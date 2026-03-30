import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import * as userService from '../services/user.service.js';
import { AuthRequest } from '../../../middleware/auth.js';

export const signup = async (req: Request, res: Response) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ status: 'error', message: 'Name, email, and password are required' });
    }

    const existingUser = await userService.findUserByEmail(email);
    if (existingUser) {
      return res.status(400).json({ status: 'error', message: 'Email already exists' });
    }

    const password_hash = await bcrypt.hash(password, 10);
    const user = await userService.createUser(name, email, password_hash);
    const token = userService.generateToken(user.user_id, user.email);

    res.status(201).json({
      status: 'success',
      data: {
        token,
        user: {
          user_id: user.user_id,
          name: user.name,
          email: user.email,
          profile: user.profile
        }
      },
      message: 'User created successfully'
    });
  } catch (error: any) {
    res.status(500).json({ status: 'error', message: error.message });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ status: 'error', message: 'Email and password are required' });
    }

    const user = await userService.findUserByEmail(email);
    if (!user || !(await bcrypt.compare(password, user.password_hash))) {
      return res.status(401).json({ status: 'error', message: 'Invalid email or password' });
    }

    const token = userService.generateToken(user.user_id, user.email);

    res.json({
      status: 'success',
      data: {
        token,
        user: {
          user_id: user.user_id,
          name: user.name,
          email: user.email,
          profile: user.profile
        }
      },
      message: 'Login successful'
    });
  } catch (error: any) {
    res.status(500).json({ status: 'error', message: error.message });
  }
};

export const getProfile = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.userId;
    if (!userId) return res.status(401).json({ status: 'error', message: 'Unauthorized' });

    const user = await userService.findUserById(userId);
    if (!user) return res.status(404).json({ status: 'error', message: 'User not found' });

    res.json({
      status: 'success',
      data: {
        user_id: user.user_id,
        name: user.name,
        email: user.email,
        profile: user.profile
      },
      message: 'Profile retrieved successfully'
    });
  } catch (error: any) {
    res.status(500).json({ status: 'error', message: error.message });
  }
};

export const updateProfile = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.userId;
    if (!userId) return res.status(401).json({ status: 'error', message: 'Unauthorized' });

    const { age, gender, height, weight } = req.body;
    const profile = await userService.updateProfile(userId, { age, gender, height, weight });

    res.json({
      status: 'success',
      data: profile,
      message: 'Profile updated successfully'
    });
  } catch (error: any) {
    res.status(500).json({ status: 'error', message: error.message });
  }
};

export const changePassword = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.userId;
    if (!userId) return res.status(401).json({ status: 'error', message: 'Unauthorized' });

    const { oldPassword, newPassword } = req.body;
    if (!oldPassword || !newPassword) {
      return res.status(400).json({ status: 'error', message: 'Old and new passwords are required' });
    }

    const user = await userService.findUserById(userId);
    if (!user || !(await bcrypt.compare(oldPassword, user.password_hash))) {
      return res.status(401).json({ status: 'error', message: 'Invalid old password' });
    }

    const new_password_hash = await bcrypt.hash(newPassword, 10);
    await userService.updatePassword(userId, new_password_hash);

    res.json({
      status: 'success',
      message: 'Password updated successfully'
    });
  } catch (error: any) {
    res.status(500).json({ status: 'error', message: error.message });
  }
};

export const deleteAccount = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.userId;
    if (!userId) return res.status(401).json({ status: 'error', message: 'Unauthorized' });

    await userService.deleteUser(userId);

    res.json({
      status: 'success',
      message: 'Account deleted successfully'
    });
  } catch (error: any) {
    res.status(500).json({ status: 'error', message: error.message });
  }
};
