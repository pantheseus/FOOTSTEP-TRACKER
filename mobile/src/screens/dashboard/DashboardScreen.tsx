import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, RefreshControl, Dimensions, Alert } from 'react-native';
import { Colors, Typography } from '../../theme';
import { useAuth } from '../../store/AuthContext';
import client from '../../api/client';
import { Footprints, Target, Flame, TrendingUp, Settings, ChevronRight, Activity } from 'lucide-react-native';
import { useFocusEffect } from '@react-navigation/native';
import { Pedometer } from 'expo-sensors';

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

  const progress = Math.min((stepsToday / dailyGoal) * 100, 100);
  const calories = Math.round(stepsToday * 0.04); // Rough estimate: 0.04 kcal per step

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

        {/* Central Progress Circle (Simplified for MVP) */}
        <View style={styles.progressContainer}>
          <View style={styles.progressRing}>
            <View style={[styles.progressBackground, { height: `${progress}%` }]} />
            <View style={styles.progressContent}>
              <Footprints size={40} color={Colors.primary} />
              <Text style={styles.stepsText}>{stepsToday}</Text>
              <Text style={Typography.caption}>steps</Text>
            </View>
          </View>
          <View style={styles.goalInfo}>
            <Target size={16} color={Colors.textSecondary} />
            <Text style={styles.goalText}>Goal: {dailyGoal}</Text>
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
});

export default DashboardScreen;
