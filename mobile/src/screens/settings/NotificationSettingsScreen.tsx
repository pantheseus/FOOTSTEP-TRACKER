import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Switch, ScrollView, SafeAreaView, ActivityIndicator } from 'react-native';
import { Colors, Typography } from '../../theme';
import client from '../../api/client';
import { ChevronLeft, Bell, Target, MessageSquare } from 'lucide-react-native';

const NotificationSettingsScreen = ({ navigation }: any) => {
  const [loading, setLoading] = useState(true);
  const [reminder, setReminder] = useState<any>(null);
  const [goalAlert, setGoalAlert] = useState(true);

  useEffect(() => {
    fetchReminders();
  }, []);

  const fetchReminders = async () => {
    try {
      const res = await client.get('/reminders');
      if (res.data.status === 'success' && res.data.data.length > 0) {
        setReminder(res.data.data[0]);
      } else {
        // Create a default reminder if none exists
        const createRes = await client.post('/reminders', { reminderTime: "20:00" });
        setReminder(createRes.data.data);
      }
    } catch (error) {
      console.error('Fetch reminders error', error);
    } finally {
      setLoading(false);
    }
  };

  const toggleDailyReminder = async (value: boolean) => {
    if (!reminder) return;
    try {
      setReminder({ ...reminder, is_active: value });
      await client.patch(`/reminders/${reminder.reminder_id}/toggle`, { isActive: value });
    } catch (error) {
      console.error('Toggle reminder error', error);
      // Revert UI on error
      setReminder({ ...reminder, is_active: !value });
    }
  };

  const SettingToggle = ({ icon: Icon, label, description, value, onValueChange, color = Colors.primary }: any) => (
    <View style={styles.item}>
      <View style={[styles.iconContainer, { backgroundColor: color + '15' }]}>
        <Icon size={20} color={color} />
      </View>
      <View style={styles.itemText}>
        <Text style={styles.itemLabel}>{label}</Text>
        <Text style={styles.itemDescription}>{description}</Text>
      </View>
      <Switch
        trackColor={{ false: "#D1D1D6", true: "#34C759" }}
        thumbColor="#fff"
        ios_backgroundColor="#D1D1D6"
        onValueChange={onValueChange}
        value={value}
      />
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <ChevronLeft size={28} color={Colors.text} />
        </TouchableOpacity>
        <Text style={Typography.h2}>Notifications</Text>
        <View style={{ width: 28 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {loading ? (
          <ActivityIndicator size="large" color={Colors.primary} style={{ marginTop: 40 }} />
        ) : (
          <>
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Daily Reminders</Text>
              <View style={styles.card}>
                <SettingToggle 
                  icon={Bell} 
                  label="Daily Reminder" 
                  description="Get a nudge at 8:00 PM if you haven't hit your goal yet."
                  value={reminder?.is_active ?? false}
                  onValueChange={toggleDailyReminder}
                  color="#FF9500" // iOS Orange
                />
              </View>
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Activity Alerts</Text>
              <View style={styles.card}>
                <SettingToggle 
                  icon={Target} 
                  label="Goal Achievement" 
                  description="Celebrate when you reach your daily step goal."
                  value={goalAlert}
                  onValueChange={setGoalAlert}
                  color="#34C759" // iOS Green
                />
                <View style={styles.divider} />
                <SettingToggle 
                  icon={MessageSquare} 
                  label="Motivational Nudges" 
                  description="Occasional tips to keep you moving."
                  value={true}
                  onValueChange={() => {}}
                  color="#5856D6" // iOS Indigo
                />
              </View>
            </View>

            <Text style={styles.footerNote}>Notification times can be customized in the next app update.</Text>
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F2F2F7' },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5EA',
  },
  backBtn: { padding: 4 },
  scrollContent: { padding: 16 },
  section: { marginBottom: 24 },
  sectionTitle: {
    fontSize: 13,
    fontWeight: '600',
    color: '#8E8E93',
    marginLeft: 16,
    marginBottom: 8,
    textTransform: 'uppercase',
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    overflow: 'hidden',
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },
  iconContainer: {
    width: 36,
    height: 36,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  itemText: { flex: 1 },
  itemLabel: { fontSize: 17, fontWeight: '600', color: Colors.text },
  itemDescription: { fontSize: 13, color: '#8E8E93', marginTop: 2 },
  divider: { height: 1, backgroundColor: '#F2F2F7', marginLeft: 64 },
  footerNote: {
    textAlign: 'center',
    color: '#8E8E93',
    fontSize: 13,
    paddingHorizontal: 32,
    marginTop: 8,
  },
});

export default NotificationSettingsScreen;
