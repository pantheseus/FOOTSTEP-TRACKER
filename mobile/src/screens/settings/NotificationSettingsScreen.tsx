import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Switch, ScrollView, SafeAreaView, ActivityIndicator, StatusBar } from 'react-native';
import { useTheme } from '../../theme';
import client from '../../api/client';
import { ChevronLeft, Bell, Target, MessageSquare } from 'lucide-react-native';

const NotificationSettingsScreen = ({ navigation }: any) => {
  const { colors, typography, isDark } = useTheme();
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
      setReminder({ ...reminder, is_active: !value });
    }
  };

  const SettingToggle = ({ icon: Icon, label, description, value, onValueChange, color = colors.primary }: any) => (
    <View style={styles.item}>
      <View style={[styles.iconContainer, { backgroundColor: color + '15' }]}>
        <Icon size={20} color={color} />
      </View>
      <View style={styles.itemText}>
        <Text style={styles.itemLabel}>{label}</Text>
        <Text style={styles.itemDescription}>{description}</Text>
      </View>
      <Switch
        trackColor={{ false: isDark ? "#3A3A3C" : "#D1D1D6", true: "#34C759" }}
        thumbColor="#fff"
        ios_backgroundColor={isDark ? "#3A3A3C" : "#D1D1D6"}
        onValueChange={onValueChange}
        value={value}
      />
    </View>
  );

  const styles = getStyles(colors, typography, isDark);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle={isDark ? "light-content" : "dark-content"} />
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <ChevronLeft size={28} color={colors.text} />
        </TouchableOpacity>
        <Text style={typography.h2}>Notifications</Text>
        <View style={{ width: 28 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {loading ? (
          <ActivityIndicator size="large" color={colors.primary} style={{ marginTop: 40 }} />
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
                  color="#FF9500" 
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
                  color="#34C759" 
                />
                <View style={styles.divider} />
                <SettingToggle 
                  icon={MessageSquare} 
                  label="Motivational Nudges" 
                  description="Occasional tips to keep you moving."
                  value={true}
                  onValueChange={() => {}}
                  color="#5856D6" 
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

const getStyles = (colors: any, typography: any, isDark: boolean) => StyleSheet.create({
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
  scrollContent: { padding: 16 },
  section: { marginBottom: 24 },
  sectionTitle: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.textSecondary,
    marginLeft: 16,
    marginBottom: 8,
    textTransform: 'uppercase',
  },
  card: {
    backgroundColor: colors.card,
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
  itemLabel: { fontSize: 17, fontWeight: '600', color: colors.text },
  itemDescription: { fontSize: 13, color: colors.textSecondary, marginTop: 2 },
  divider: { height: 1, backgroundColor: colors.background, marginLeft: 64 },
  footerNote: {
    textAlign: 'center',
    color: colors.textSecondary,
    fontSize: 13,
    paddingHorizontal: 32,
    marginTop: 8,
  },
});

export default NotificationSettingsScreen;
