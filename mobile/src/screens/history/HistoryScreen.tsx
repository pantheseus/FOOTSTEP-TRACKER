import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, ActivityIndicator, RefreshControl } from 'react-native';
import { Colors, Typography } from '../../theme';
import client from '../../api/client';
import { ArrowLeft, Calendar } from 'lucide-react-native';

const HistoryScreen = ({ navigation }: any) => {
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
    return (
      <View style={styles.historyItem}>
        <View style={styles.dateBox}>
          <Text style={styles.dateDay}>{date.getDate()}</Text>
          <Text style={styles.dateMonth}>{date.toLocaleDateString(undefined, { month: 'short' })}</Text>
        </View>
        <View style={styles.infoContent}>
          <Text style={styles.stepsText}>{item.step_count.toLocaleString()} steps</Text>
          <Text style={styles.dayText}>{date.toLocaleDateString(undefined, { weekday: 'long' })}</Text>
        </View>
        <View style={styles.progressBadge}>
          <Text style={styles.badgeText}>{Math.round((item.step_count / 5000) * 100)}%</Text>
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <ArrowLeft size={24} color={Colors.text} />
        </TouchableOpacity>
        <Text style={Typography.h2}>History</Text>
        <View style={{ width: 24 }} />
      </View>

      {loading ? (
        <View style={styles.loader}>
          <ActivityIndicator size="large" color={Colors.primary} />
        </View>
      ) : (
        <FlatList
          data={history}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          contentContainerStyle={styles.listContent}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
          ListEmptyComponent={
            <View style={styles.emptyContent}>
              <Calendar size={48} color={Colors.surface} />
              <Text style={styles.emptyText}>No history found</Text>
            </View>
          }
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.white },
  header: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center', 
    padding: 24, 
    paddingTop: 60,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  loader: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  listContent: { padding: 24 },
  historyItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surface,
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
  },
  dateBox: {
    width: 60,
    height: 60,
    backgroundColor: Colors.white,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.border,
  },
  dateDay: { fontSize: 20, fontWeight: '700', color: Colors.primary },
  dateMonth: { fontSize: 12, color: Colors.textSecondary, textTransform: 'uppercase' },
  infoContent: { flex: 1, marginLeft: 16 },
  stepsText: { fontSize: 18, fontWeight: '700', color: Colors.text },
  dayText: { fontSize: 14, color: Colors.textSecondary },
  progressBadge: {
    backgroundColor: '#6366f120',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  badgeText: { fontSize: 12, fontWeight: '700', color: Colors.primary },
  emptyContent: { alignItems: 'center', justifyContent: 'center', marginTop: 100 },
  emptyText: { marginTop: 16, color: Colors.textSecondary, fontSize: 16 },
});

export default HistoryScreen;
