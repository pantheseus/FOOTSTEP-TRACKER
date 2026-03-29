# Footstep Tracking Backend

This is the backend service for the Footstep Tracking App.

## Tech Stack
- Node.js & Express
- TypeScript
- PostgreSQL with Prisma ORM
- JWT Authentication
- Modular Monolith Architecture

## Modular Structure
- `src/modules/user`: Auth and Profile management.
- `src/modules/steps`: Daily step tracking and history.
- `src/modules/goals`: Goal setting and retrieval.
- `src/modules/reminders`: Daily reminders.

## Getting Started

1. **Install Dependencies**:
   ```bash
   npm install
   ```

2. **Environment Setup**:
   Copy `.env.example` to `.env` and update the `DATABASE_URL` and `JWT_SECRET`.
   ```bash
   cp .env.example .env
   ```

3. **Database Migration**:
   ```bash
   npx prisma migrate dev
   ```

4. **Run in Development**:
   ```bash
   npm run dev
   ```

## API Documentation

### Auth
- `POST /api/v1/user/signup`: Create a new account.
- `POST /api/v1/user/login`: Login to an existing account.

### Profile
- `GET /api/v1/user/profile`: Get current user profile.
- `PUT /api/v1/user/profile`: Update user profile (age, gender).

### Steps
- `POST /api/v1/steps`: Update daily steps.
- `GET /api/v1/steps/today`: Get steps for today.
- `GET /api/v1/steps/history`: Get 7-day step history.

### Goals
- `POST /api/v1/goals`: Set daily step goal.
- `GET /api/v1/goals`: Get current daily step goal.

### Reminders
- `POST /api/v1/reminders`: Create a reminder.
- `GET /api/v1/reminders`: Get active reminders.
- `PATCH /api/v1/reminders/:reminderId/toggle`: Toggle reminder status.
