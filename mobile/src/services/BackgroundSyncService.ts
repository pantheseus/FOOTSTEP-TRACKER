import * as TaskManager from 'expo-task-manager';
import * as BackgroundFetch from 'expo-background-fetch';
import { Pedometer } from 'expo-sensors';
import client from '../api/client';

const BACKGROUND_STEP_SYNC_TASK = 'background-step-sync';

// Define the background task
TaskManager.defineTask(BACKGROUND_STEP_SYNC_TASK, async () => {
  try {
    const now = new Date();
    const midnight = new Date();
    midnight.setHours(0, 0, 0, 0);

    const isAvailable = await Pedometer.isAvailableAsync();
    if (!isAvailable) return BackgroundFetch.BackgroundFetchResult.NoData;

    const result = await Pedometer.getStepCountAsync(midnight, now);
    if (result && result.steps > 0) {
      const today = now.toISOString().split('T')[0];
      await client.post('/steps', { date: today, stepCount: result.steps });
      console.log('Background sync successful:', result.steps);
      return BackgroundFetch.BackgroundFetchResult.NewData;
    }

    return BackgroundFetch.BackgroundFetchResult.NoData;
  } catch (error) {
    console.error('Background sync failed:', error);
    return BackgroundFetch.BackgroundFetchResult.Failed;
  }
});

// Helper to register the task
export const registerBackgroundSync = async () => {
  try {
    await BackgroundFetch.registerTaskAsync(BACKGROUND_STEP_SYNC_TASK, {
      minimumInterval: 15 * 60, // 15 minutes (minimum allowed by OS)
      stopOnTerminate: false,   // Continue even if app is closed
      startOnBoot: true,        // Restart when phone turns on
    });
    console.log('Background Sync Task registered');
  } catch (err) {
    console.error('Task registration failed:', err);
  }
};
