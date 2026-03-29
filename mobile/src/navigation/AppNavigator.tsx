import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import DashboardScreen from '../screens/dashboard/DashboardScreen';
import GoalSettingScreen from '../screens/goal/GoalSettingScreen';
import HistoryScreen from '../screens/history/HistoryScreen';

const Stack = createStackNavigator();

const AppNavigator = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Dashboard" component={DashboardScreen} />
      <Stack.Screen name="GoalSetting" component={GoalSettingScreen} />
      <Stack.Screen name="History" component={HistoryScreen} />
    </Stack.Navigator>
  );
};

export default AppNavigator;
