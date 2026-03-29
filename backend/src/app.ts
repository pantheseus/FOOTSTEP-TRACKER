import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import dotenv from 'dotenv';
import userRoutes from './modules/user/routes/user.routes.js';
import stepRoutes from './modules/steps/routes/step.routes.js';
import goalRoutes from './modules/goals/routes/goal.routes.js';
import reminderRoutes from './modules/reminders/routes/reminder.routes.js';

dotenv.config();

const app = express();

// Middleware
app.use(express.json());
app.use(cors());
app.use(helmet());
app.use(morgan('dev'));

// Routes
app.use('/api/v1/user', userRoutes);
app.use('/api/v1/auth', userRoutes); // Signup/Login are in userRoutes
app.use('/api/v1/steps', stepRoutes);
app.use('/api/v1/goals', goalRoutes);
app.use('/api/v1/reminders', reminderRoutes);

app.get('/', (req, res) => {
  res.json({ status: 'success', message: 'Footstep Tracking API is running' });
});

export default app;
