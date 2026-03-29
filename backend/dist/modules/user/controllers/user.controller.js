import bcrypt from 'bcrypt';
import * as userService from '../services/user.service.js';
export const signup = async (req, res) => {
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
    }
    catch (error) {
        res.status(500).json({ status: 'error', message: error.message });
    }
};
export const login = async (req, res) => {
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
    }
    catch (error) {
        res.status(500).json({ status: 'error', message: error.message });
    }
};
export const getProfile = async (req, res) => {
    try {
        const userId = req.user?.userId;
        if (!userId)
            return res.status(401).json({ status: 'error', message: 'Unauthorized' });
        const user = await userService.findUserById(userId);
        if (!user)
            return res.status(404).json({ status: 'error', message: 'User not found' });
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
    }
    catch (error) {
        res.status(500).json({ status: 'error', message: error.message });
    }
};
export const updateProfile = async (req, res) => {
    try {
        const userId = req.user?.userId;
        if (!userId)
            return res.status(401).json({ status: 'error', message: 'Unauthorized' });
        const { age, gender } = req.body;
        const profile = await userService.updateProfile(userId, age, gender);
        res.json({
            status: 'success',
            data: profile,
            message: 'Profile updated successfully'
        });
    }
    catch (error) {
        res.status(500).json({ status: 'error', message: error.message });
    }
};
