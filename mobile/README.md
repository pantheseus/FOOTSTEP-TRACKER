# Footstep Tracking Mobile App

A clean, minimal React Native app for tracking your daily wellness progress.

## Tech Stack
- React Native (Expo)
- React Navigation
- Axios for API communication
- Lucide React Native for icons
- Expo Secure Store for JWT persistence

## Features
- **Dashboard**: Track today's steps, view progress against your goal, and see a 7-day summary.
- **Authentication**: Secure Login and Signup.
- **Goal Setting**: Customize your daily step goals and manage your profile (age, gender).
- **History**: Detailed log of your past step activity.
- **Simulation**: Easy-to-use button for simulating step progress for testing.

## Getting Started

1. **Install Expo Go**:
   Download the Expo Go app on your iOS or Android device.

2. **Install Dependencies**:
   ```bash
   cd mobile
   npm install
   ```

3. **Configure API**:
   Update `src/api/client.ts` with your backend's local IP address (e.g., `http://192.168.1.XX:5000/api/v1`).

4. **Run the App**:
   ```bash
   npx expo start
   ```
   Scan the QR code with your phone or run on an emulator.

## Clean Architecture
- `src/api`: Unified API communication layer.
- `src/navigation`: Separate navigators for Auth and App flows.
- `src/store`: State management using React Context.
- `src/theme`: Centralized design system with colors and typography.
- `src/screens`: Modular screen components organized by feature.
