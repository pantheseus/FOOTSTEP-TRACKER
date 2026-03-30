import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, ActivityIndicator, RefreshControl, SafeAreaView, StatusBar } from 'react-native';
import { useTheme } from '../../theme';
import client from '../../api/client';
import { ArrowLeft, Calendar } from 'lucide-react-native';

const HistoryScreen = ({ navigation }: any) => {
  const { colors, typography, isDark } = useTheme();
  const [history, setHistory] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    try {
      const response = await client.get('/steps/history?limit=30');
      if (response.data.status === 'success') {
        setHistory(response.data.data);
      }
    } catch (error) {
      console.error('Error fetching history', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    fetchHistory();
  };

  const renderItem = ({ item }: { item: any }) => {
    const date = new Date(item.date);
    const progress = Math.min((item.step_count / 5000) * 100, 100);
    
    return (
      <View style={styles.historyItem}>
        <View style={styles.dateBox}>
          <Text style={styles.dateDay}>{date.getDate()}</Text>
          <Text style={styles.dateMonth}>{date.toLocaleDateString(undefined, { month: 'short' })}</Text>
        </View>
        <View style={styles.infoContent}>
          <Text style={styles.stepsText}>{item.step_count.toLocaleString()} steps</Text>
          <Text style={styles.dayText}>{date.toLocaleDateString(undefined, { weekday: 'long' })}</Text>
          
          <View style={styles.miniBarContainer}>
            <View style={[styles.miniBar, { width: `${progress}%`, backgroundColor: colors.primary }]} />
          </View>
        </View>
        <View style={[styles.progressBadge, { backgroundColor: colors.primary + '15' }]}>
          <Text style={[styles.badgeText, { color: colors.primary }]}>{Math.round(progress)}%</Text>
        </View>
      </View>
    );
  };

  const styles = getStyles(colors, typography);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle={isDark ? "light-content" : "dark-content"} />
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <ArrowLeft size={28} color={colors.text} />
        </TouchableOpacity>
        <Text style={typography.h2}>History</Text>
        <View style={{ width: 28 }} />
      </View>

      {loading ? (
        <View style={styles.loader}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      ) : (
        <FlatList
          data={history}
          keyExtractor={(item) => item.step_id || item.date}
          renderItem={renderItem}
          contentContainerStyle={styles.listContent}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={colors.primary} />}
          ListEmptyComponent={
            <View style={styles.emptyContent}>
              <Calendar size={64} color={colors.textSecondary} opacity={0.2} />
              <Text style={styles.emptyText}>No activity recorded yet.</Text>
            </View>
          }
        />
      )}
    </SafeAreaView>
  );
};

const getStyles = (colors: any, typography: any) => StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  header: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center', 
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: colors.card,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  backBtn: { padding: 4 },
  loader: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: colors.background },
  listContent: { padding: 16 },
  historyItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.card,
    padding: 16,
    borderRadius: 20,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  dateBox: {
    width: 54,
    height: 54,
    backgroundColor: colors.background,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  dateDay: { fontSize: 20, fontWeight: '800', color: colors.text },
  dateMonth: { fontSize: 11, color: colors.textSecondary, textTransform: 'uppercase', fontWeight: '700' },
  infoContent: { flex: 1, marginLeft: 16 },
  stepsText: { fontSize: 18, fontWeight: '700', color: colors.text },
  dayText: { fontSize: 13, color: colors.textSecondary, marginBottom: 8 },
  miniBarContainer: { height: 4, backgroundColor: colors.background, borderRadius: 2, width: '80%', overflow: 'hidden' },
  miniBar: { height: '100%', borderRadius: 2 },
  progressBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  badgeText: { fontSize: 12, fontWeight: '800' },
  emptyContent: { alignItems: 'center', justifyContent: 'center', marginTop: 100 },
  emptyText: { marginTop: 16, color: colors.textSecondary, fontSize: 16, fontWeight: '600' },
});

export default HistoryScreen;
