import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, SafeAreaView, StatusBar } from 'react-native';
import { useTheme } from '../../theme';
import { useAuth } from '../../store/AuthContext';
import { User, LogOut, ChevronLeft, Shield, Bell, CircleHelp, Target } from 'lucide-react-native';

const SettingsScreen = ({ navigation }: any) => {
  const { user, logout } = useAuth();
  const { colors, typography, isDark } = useTheme();

  const SettingItem = ({ icon: Icon, label, onPress, destructive }: any) => (
    <TouchableOpacity style={styles.item} onPress={onPress}>
      <View style={[styles.iconContainer, destructive && styles.destructiveIcon]}>
        <Icon size={20} color={destructive ? colors.error : colors.primary} />
      </View>
      <Text style={[styles.itemLabel, destructive && { color: colors.error }]}>{label}</Text>
      {!destructive && <Text style={styles.arrow}>›</Text>}
    </TouchableOpacity>
  );

  const styles = getStyles(colors, typography);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle={isDark ? "light-content" : "dark-content"} />
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <ChevronLeft size={28} color={colors.text} />
        </TouchableOpacity>
        <Text style={typography.h2}>Settings</Text>
        <View style={{ width: 28 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.profileCard}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>{user?.name?.charAt(0)}</Text>
          </View>
          <Text style={styles.userName}>{user?.name}</Text>
          <Text style={styles.userEmail}>{user?.email}</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Account</Text>
          <View style={styles.card}>
            <SettingItem 
              icon={User} 
              label="Personal Information" 
              onPress={() => navigation.navigate("PersonalInformation")}
            />
            <View style={styles.divider} />
            <SettingItem 
              icon={Target} 
              label="Step Goal" 
              onPress={() => navigation.navigate("GoalSetting")}
            />
            <View style={styles.divider} />
            <SettingItem 
              icon={Bell} 
              label="Notifications" 
              onPress={() => navigation.navigate("NotificationSettings")}
            />
            <View style={styles.divider} />
            <SettingItem 
              icon={Shield} 
              label="Privacy & Security" 
              onPress={() => navigation.navigate("SecuritySettings")}
            />
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Support</Text>
          <View style={styles.card}>
            <SettingItem 
              icon={CircleHelp} 
              label="Help Center" 
              onPress={() => navigation.navigate("HelpCenter")}
            />
          </View>
        </View>

        <View style={styles.section}>
          <View style={styles.card}>
            <SettingItem 
              icon={LogOut} 
              label="Log Out" 
              onPress={logout}
              destructive 
            />
          </View>
        </View>

        <Text style={styles.version}>Version 1.0.0 (Apple Edition)</Text>
      </ScrollView>
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
  },
  backBtn: { padding: 4 },
  scrollContent: { padding: 16 },
  profileCard: {
    backgroundColor: colors.card,
    borderRadius: 20,
    padding: 24,
    alignItems: 'center',
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 2,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: colors.background,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  avatarText: { fontSize: 32, fontWeight: '600', color: colors.textSecondary },
  userName: { fontSize: 22, fontWeight: '700', color: colors.text },
  userEmail: { fontSize: 15, color: colors.textSecondary, marginTop: 4 },
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
    padding: 14,
    paddingHorizontal: 16,
  },
  iconContainer: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: colors.background,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  destructiveIcon: { backgroundColor: colors.error + '15' },
  itemLabel: { flex: 1, fontSize: 17, color: colors.text },
  arrow: { fontSize: 20, color: colors.textSecondary, fontWeight: '300', opacity: 0.5 },
  divider: { height: 1, backgroundColor: colors.background, marginLeft: 60 },
  version: {
    textAlign: 'center',
    color: colors.textSecondary,
    fontSize: 13,
    marginTop: 8,
    marginBottom: 32,
  },
});

export default SettingsScreen;
