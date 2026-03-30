import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, RefreshControl, Dimensions, Alert } from 'react-native';
import { Colors, Typography } from '../../theme';
import { useAuth } from '../../store/AuthContext';
import client from '../../api/client';
import { Footprints, Target, Flame, TrendingUp, Settings, ChevronRight, Activity, MapPin, Clock } from 'lucide-react-native';
import { useFocusEffect } from '@react-navigation/native';
import { Pedometer } from 'expo-sensors';
import { registerBackgroundSync } from '../../services/BackgroundSyncService';

const { width } = Dimensions.get('window');

const DashboardScreen = ({ navigation }: any) => {
  const { user, logout } = useAuth();
  const [stepsToday, setStepsToday] = useState(0);
  const [dailyGoal, setDailyGoal] = useState(5000);
  const [history, setHistory] = useState<any[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [isPedometerAvailable, setIsPedometerAvailable] = useState('checking');
  const [lastSavedSteps, setLastSavedSteps] = useState(0);

  const fetchData = async () => {
    try {
      const [stepsRes, goalRes, historyRes] = await Promise.all([
        client.get('/steps/today'),
        client.get('/goals'),
        client.get('/steps/history')
      ]);

      if (stepsRes.data.status === 'success') {
        const backendSteps = stepsRes.data.data.step_count || 0;
        setStepsToday(backendSteps);
        setLastSavedSteps(backendSteps);
      }
      if (goalRes.data.status === 'success') setDailyGoal(goalRes.data.data.daily_goal || 5000);
      if (historyRes.data.status === 'success') setHistory(historyRes.data.data);
    } catch (error) {
      console.error('Error fetching dashboard data', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchData();
    }, [])
  );

  // Automatic Pedometer Tracking & Permission Handling
  useEffect(() => {
    let subscription: any = null;

    const initializePedometer = async () => {
      // 1. Check & Request Permissions
      const { status } = await Pedometer.requestPermissionsAsync();
      setIsPedometerAvailable(status === 'granted' ? 'true' : 'false');

      if (status !== 'granted') {
        return;
      }

      // 2. Fetch Historical Steps Since Midnight
      const start = new Date();
      start.setHours(0, 0, 0, 0); // Today at 00:00:00
      const end = new Date();

      try {
        const result = await Pedometer.getStepCountAsync(start, end);
        if (result) {
          setStepsToday(result.steps);
          setLastSavedSteps(result.steps);
        }
      } catch (e) {
        console.error('Could not fetch historical steps', e);
      }

      // 3. Start Watching for Live Steps
      subscription = Pedometer.watchStepCount((result) => {
        // We will re-fetch the absolute total from history occasionally for accuracy
      });

      // Refetch absolute total every 30 seconds for maximum reliability
      const interval = setInterval(async () => {
        const now = new Date();
        const midnight = new Date();
        midnight.setHours(0, 0, 0, 0);
        const latest = await Pedometer.getStepCountAsync(midnight, now);
        setStepsToday(latest.steps);
      }, 30000);

      // 4. Register Background Sync
      registerBackgroundSync();

      return () => {
        clearInterval(interval);
      };
    };

    initializePedometer();

    return () => {
      if (subscription) subscription.remove();
    };
  }, []);

  // Auto-sync to backend every 100 new steps
  useEffect(() => {
    const syncSteps = async () => {
      if (stepsToday > lastSavedSteps + 50) { // Sync every 50 steps for better accuracy
        try {
          const today = new Date().toISOString().split('T')[0];
          await client.post('/steps', { date: today, stepCount: stepsToday });
          setLastSavedSteps(stepsToday);
          console.log('Synced steps to cloud:', stepsToday);
        } catch (error) {
          console.error('Failed to sync steps', error);
        }
      }
    };

    syncSteps();
  }, [stepsToday]);

  const onRefresh = () => {
    setRefreshing(true);
    fetchData();
  };

  const distance = (stepsToday * 0.000762).toFixed(2); // Stride length 0.762m -> km
  const progress = Math.min((stepsToday / dailyGoal) * 100, 100);
  const calories = Math.round(stepsToday * 0.04);

  return (
    <View style={styles.container}>
      <ScrollView 
        contentContainerStyle={styles.scrollContent}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      >
        <View style={styles.header}>
          <View>
            <Text style={styles.dayText}>{new Date().toLocaleDateString(undefined, { weekday: 'long', day: 'numeric', month: 'long' })}</Text>
            <Text style={Typography.h1}>Activity</Text>
          </View>
          <TouchableOpacity onPress={() => navigation.navigate('Settings')}>
            <View style={styles.headerAvatar}>
               <Text style={styles.avatarText}>{user?.name?.charAt(0)}</Text>
            </View>
          </TouchableOpacity>
        </View>

        {/* Central Progress Circle */}
        <View style={styles.progressContainer}>
          <View style={styles.progressRing}>
            <View style={[styles.progressBackground, { height: `${progress}%` }]} />
            <View style={styles.progressContent}>
              <Footprints size={48} color="#FF2D55" /> 
              <Text style={styles.stepsText}>{stepsToday}</Text>
              <Text style={styles.stepsLabel}>STEPS</Text>
            </View>
          </View>
        </View>

        {/* Quick Stats Grid */}
        <View style={styles.quickStatsRow}>
           <View style={styles.quickStatCard}>
              <Text style={styles.quickStatLabel}>DISTANCE</Text>
              <Text style={styles.quickStatValue}>{distance} <Text style={styles.unit}>KM</Text></Text>
           </View>
           <View style={styles.quickStatCard}>
              <Text style={styles.quickStatLabel}>CALORIES</Text>
              <Text style={styles.quickStatValue}>{calories} <Text style={styles.unit}>KCAL</Text></Text>
           </View>
        </View>

        {/* History Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={Typography.h2}>Activity History</Text>
            <TouchableOpacity onPress={() => navigation.navigate('History')}>
              <Text style={styles.viewAll}>Show All</Text>
            </TouchableOpacity>
          </View>
          
          <View style={styles.historyList}>
            {history.length > 0 ? history.map((item, index) => (
              <View key={index} style={styles.historyItem}>
                <Text style={styles.historyDate}>{new Date(item.date).toLocaleDateString(undefined, { weekday: 'short' })}</Text>
                <View style={styles.historyBarContainer}>
                  <View style={[styles.historyBar, { width: `${Math.min((item.step_count / dailyGoal) * 100, 100)}%` }]} />
                </View>
                <Text style={styles.historyValue}>{item.step_count}</Text>
              </View>
            )) : (
              <Text style={styles.emptyText}>No data available yet.</Text>
            )}
          </View>
        </View>

        {isPedometerAvailable === 'false' && (
          <View style={styles.errorBanner}>
            <Activity size={20} color="#FF3B30" />
            <View style={{ flex: 1 }}>
              <Text style={styles.errorText}>Motion Permission Required.</Text>
              <TouchableOpacity onPress={() => Pedometer.requestPermissionsAsync()}>
                <Text style={[styles.errorText, { textDecorationLine: 'underline', marginTop: 4 }]}>Open Settings</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F2F2F7' },
  scrollContent: { padding: 20, paddingTop: 60 },
  header: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'flex-end', 
    marginBottom: 24,
    paddingHorizontal: 4,
  },
  dayText: { fontSize: 13, fontWeight: '600', color: '#8E8E93', textTransform: 'uppercase', marginBottom: 2 },
  headerAvatar: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: '#E5E5EA',
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: { fontSize: 16, fontWeight: '600', color: '#8E8E93' },
  progressContainer: { alignItems: 'center', marginBottom: 24 },
  progressRing: {
    width: 280,
    height: 280,
    borderRadius: 140,
    borderWidth: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.1,
    shadowRadius: 20,
    elevation: 10,
    overflow: 'hidden',
  },
  progressBackground: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#FF2D5515',
  },
  progressContent: { alignItems: 'center' },
  stepsText: { fontSize: 64, fontWeight: '800', color: Colors.text, letterSpacing: -2 },
  stepsLabel: { fontSize: 14, fontWeight: '700', color: '#8E8E93', marginTop: -4, letterSpacing: 1 },
  quickStatsRow: { flexDirection: 'row', gap: 12, marginBottom: 24 },
  quickStatCard: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
  },
  quickStatLabel: { fontSize: 11, fontWeight: '700', color: '#8E8E93', marginBottom: 4 },
  quickStatValue: { fontSize: 24, fontWeight: '800', color: Colors.text },
  unit: { fontSize: 13, color: '#8E8E93', fontWeight: '600' },
  section: { marginBottom: 32 },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16, paddingHorizontal: 4 },
  viewAll: { color: '#007AFF', fontWeight: '600', fontSize: 15 },
  historyList: { backgroundColor: '#fff', borderRadius: 20, padding: 16 },
  historyItem: { flexDirection: 'row', alignItems: 'center', gap: 12, marginVertical: 8 },
  historyDate: { width: 45, fontSize: 14, fontWeight: '600', color: '#8E8E93' },
  historyBarContainer: { flex: 1, height: 8, backgroundColor: '#F2F2F7', borderRadius: 4, overflow: 'hidden' },
  historyBar: { height: '100%', backgroundColor: '#FF2D55', borderRadius: 4 },
  historyValue: { width: 50, fontSize: 14, fontWeight: '700', color: Colors.text, textAlign: 'right' },
  emptyText: { textAlign: 'center', color: '#8E8E93', fontSize: 14, padding: 20 },
  errorBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 20,
    marginBottom: 24,
    gap: 12,
  },
  errorText: { color: '#FF3B30', fontSize: 15, fontWeight: '600' },
});

export default DashboardScreen;
