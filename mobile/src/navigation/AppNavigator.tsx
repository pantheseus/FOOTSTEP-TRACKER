import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import DashboardScreen from '../screens/dashboard/DashboardScreen';
import GoalSettingScreen from '../screens/goal/GoalSettingScreen';
import HistoryScreen from '../screens/history/HistoryScreen';
import SettingsScreen from '../screens/settings/SettingsScreen';
import PersonalInformationScreen from '../screens/settings/PersonalInformationScreen';
import SecuritySettingsScreen from '../screens/settings/SecuritySettingsScreen';
import NotificationSettingsScreen from '../screens/settings/NotificationSettingsScreen';
import HelpCenterScreen from '../screens/settings/HelpCenterScreen';
import DiagnosticScreen from '../screens/settings/DiagnosticScreen';

const Stack = createStackNavigator();

const AppNavigator = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Dashboard" component={DashboardScreen} />
      <Stack.Screen name="GoalSetting" component={GoalSettingScreen} />
      <Stack.Screen name="History" component={HistoryScreen} />
      <Stack.Screen name="Settings" component={SettingsScreen} />
      <Stack.Screen name="PersonalInformation" component={PersonalInformationScreen} />
      <Stack.Screen name="SecuritySettings" component={SecuritySettingsScreen} />
      <Stack.Screen name="NotificationSettings" component={NotificationSettingsScreen} />
      <Stack.Screen name="HelpCenter" component={HelpCenterScreen} />
      <Stack.Screen name="Diagnostic" component={DiagnosticScreen} />
    </Stack.Navigator>
  );
};

export default AppNavigator;
