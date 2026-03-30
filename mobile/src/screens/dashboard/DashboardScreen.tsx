import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, RefreshControl, Dimensions, Alert } from 'react-native';
import { Colors, Typography } from '../../theme';
import { useAuth } from '../../store/AuthContext';
import client from '../../api/client';
import { Footprints, Target, Flame, TrendingUp, Settings, ChevronRight, Activity, Play, Square, MapPin, Clock } from 'lucide-react-native';
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
  const [isTracking, setIsTracking] = useState(false);
  const [activeTime, setActiveTime] = useState(0); // in seconds
  const [sessionSteps, setSessionSteps] = useState(0);

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

  // Real-time Pedometer Tracking & Permission Handling
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
        // Important: result.steps is incremental from the start of the subscription
        // We will just re-fetch the absolute total from history occasionally for accuracy
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

  // Session Timer & Tracking Logic
  useEffect(() => {
    let timer: NodeJS.Timeout | null = null;
    let sessionSubscription: any = null;

    if (isTracking) {
      // Start Timer
      timer = setInterval(() => {
        setActiveTime((prev) => prev + 1);
      }, 1000);

      // Start Session Step Tracking
      const startSession = async () => {
        sessionSubscription = Pedometer.watchStepCount((result) => {
          setSessionSteps(result.steps);
        });
      };
      startSession();
    } else {
      if (timer) clearInterval(timer);
      if (sessionSubscription) sessionSubscription.remove();
      // We don't reset sessionSteps/activeTime here so user can see their last session stats
    }

    return () => {
      if (timer) clearInterval(timer);
      if (sessionSubscription) sessionSubscription.remove();
    };
  }, [isTracking]);

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

  const progress = Math.min((stepsToday / dailyGoal) * 100, 100);
  const calories = Math.round(stepsToday * 0.04); // Rough estimate: 0.04 kcal per step
  const distance = (stepsToday * 0.000762).toFixed(2); // Stride length 0.762m -> km

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  const toggleTracking = () => {
    if (!isTracking) {
      setSessionSteps(0);
      setActiveTime(0);
      setIsTracking(true);
    } else {
      setIsTracking(false);
      Alert.alert("Session Finished", `You walked ${sessionSteps} steps in ${formatTime(activeTime)}!`);
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView 
        contentContainerStyle={styles.scrollContent}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      >
        <View style={styles.header}>
          <View>
            <Text style={Typography.caption}>Welcome back,</Text>
            <Text style={Typography.h2}>{user?.name}</Text>
          </View>
          <TouchableOpacity onPress={() => navigation.navigate('GoalSetting')}>
            <Settings size={24} color={Colors.textSecondary} />
          </TouchableOpacity>
        </View>

        {/* Central Progress Circle */}
        <View style={styles.progressContainer}>
          <View style={[styles.progressRing, isTracking && styles.trackingRing]}>
            <View style={[styles.progressBackground, { height: `${progress}%` }]} />
            <View style={styles.progressContent}>
              <Footprints size={44} color={isTracking ? Colors.primary : Colors.textSecondary} />
              <Text style={styles.stepsText}>{stepsToday}</Text>
              <Text style={Typography.caption}>steps today</Text>
            </View>
          </View>
          <View style={styles.goalInfo}>
            <Target size={16} color={Colors.textSecondary} />
            <Text style={styles.goalText}>Goal: {dailyGoal}</Text>
          </View>
        </View>

        {/* Tracking Controls */}
        <View style={styles.trackingCard}>
          <TouchableOpacity 
            style={[styles.trackBtn, isTracking ? styles.stopBtn : styles.startBtn]} 
            onPress={toggleTracking}
          >
            {isTracking ? <Square size={20} color={Colors.white} /> : <Play size={20} color={Colors.white} />}
            <Text style={styles.trackBtnText}>{isTracking ? 'Stop Tracking' : 'Start Walking'}</Text>
          </TouchableOpacity>
          
          <View style={styles.sessionStats}>
            <View style={styles.sessionStatItem}>
              <Clock size={16} color={Colors.textSecondary} />
              <Text style={styles.sessionStatValue}>{formatTime(activeTime)}</Text>
            </View>
            <View style={styles.divider} />
            <View style={styles.sessionStatItem}>
              <MapPin size={16} color={Colors.textSecondary} />
              <Text style={styles.sessionStatValue}>{distance} km</Text>
            </View>
          </View>
        </View>

        {/* Stats Cards */}
        <View style={styles.statsRow}>
          <View style={styles.statCard}>
            <TrendingUp size={20} color={Colors.primary} />
            <Text style={styles.statValue}>{Math.round(progress)}%</Text>
            <Text style={Typography.caption}>of daily goal</Text>
          </View>
          <View style={styles.statCard}>
            <Flame size={20} color="#f97316" />
            <Text style={styles.statValue}>{calories}</Text>
            <Text style={Typography.caption}>kcal burned</Text>
          </View>
        </View>

        {/* History Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={Typography.h2}>Last 7 Days</Text>
            <TouchableOpacity onPress={() => navigation.navigate('History')}>
              <Text style={styles.viewAll}>View History</Text>
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
              <Text style={styles.emptyText}>No history yet. Start walking!</Text>
            )}
          </View>
        </View>

        {isPedometerAvailable === 'false' && (
          <View style={styles.errorBanner}>
            <Activity size={20} color={Colors.error} />
            <View style={{ flex: 1 }}>
              <Text style={styles.errorText}>Physical Activity Permission Required.</Text>
              <TouchableOpacity onPress={() => Pedometer.requestPermissionsAsync()}>
                <Text style={[styles.errorText, { textDecorationLine: 'underline', marginTop: 4 }]}>Grant Permission</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}

        <TouchableOpacity style={styles.logoutBtn} onPress={logout}>
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.white },
  scrollContent: { padding: 24, paddingTop: 60 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 32 },
  progressContainer: { alignItems: 'center', marginBottom: 40 },
  progressRing: {
    width: 240,
    height: 240,
    borderRadius: 120,
    borderWidth: 15,
    borderColor: Colors.surface,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
    overflow: 'hidden',
  },
  progressBackground: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#6366f120',
  },
  progressContent: { alignItems: 'center', zIndex: 1 },
  stepsText: { fontSize: 48, fontWeight: '800', color: Colors.text, marginVertical: -4 },
  goalInfo: { flexDirection: 'row', alignItems: 'center', marginTop: 16, gap: 4 },
  goalText: { fontSize: 16, color: Colors.textSecondary, fontWeight: '500' },
  statsRow: { flexDirection: 'row', gap: 16, marginBottom: 32 },
  statCard: {
    flex: 1,
    backgroundColor: Colors.surface,
    padding: 20,
    borderRadius: 16,
    alignItems: 'center',
    gap: 4,
  },
  statValue: { fontSize: 20, fontWeight: '700', color: Colors.text },
  section: { marginBottom: 32 },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
  viewAll: { color: Colors.primary, fontWeight: '600' },
  historyList: { gap: 16 },
  historyItem: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  historyDate: { width: 45, fontSize: 14, color: Colors.textSecondary },
  historyBarContainer: { flex: 1, height: 10, backgroundColor: Colors.surface, borderRadius: 5, overflow: 'hidden' },
  historyBar: { height: '100%', backgroundColor: Colors.primary, borderRadius: 5 },
  historyValue: { width: 50, fontSize: 14, fontWeight: '600', textAlign: 'right' },
  emptyText: { textAlign: 'center', color: Colors.textSecondary, fontStyle: 'italic' },
  simulateBtn: {
    backgroundColor: Colors.surface,
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 16,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  simulateText: { color: Colors.primary, fontWeight: '600' },
  logoutBtn: { padding: 16, alignItems: 'center' },
  logoutText: { color: Colors.error, fontSize: 14, fontWeight: '600' },
  errorBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fee2e2',
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
    gap: 8,
  },
  errorText: { color: Colors.error, fontSize: 12, fontWeight: '500' },
  trackingRing: {
    borderColor: Colors.primary,
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.3,
    shadowRadius: 15,
    elevation: 8,
  },
  trackingCard: {
    backgroundColor: Colors.surface,
    padding: 20,
    borderRadius: 24,
    marginBottom: 32,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.border,
  },
  startBtn: { backgroundColor: Colors.primary },
  stopBtn: { backgroundColor: Colors.error },
  trackBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 32,
    borderRadius: 100,
    gap: 12,
    marginBottom: 16,
  },
  trackBtnText: { color: Colors.white, fontSize: 18, fontWeight: '700' },
  sessionStats: { flexDirection: 'row', alignItems: 'center', gap: 24 },
  sessionStatItem: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  sessionStatValue: { fontSize: 16, fontWeight: '600', color: Colors.text },
  divider: { width: 1, height: 20, backgroundColor: Colors.border },
});

export default DashboardScreen;
