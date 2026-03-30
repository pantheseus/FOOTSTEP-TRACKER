import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, SafeAreaView } from 'react-native';
import { Colors, Typography } from '../../theme';
import { useAuth } from '../../store/AuthContext';
import { User, LogOut, ChevronLeft, Shield, Bell, CircleHelp } from 'lucide-react-native';

const SettingsScreen = ({ navigation }: any) => {
  const { user, logout } = useAuth();

  const SettingItem = ({ icon: Icon, label, onPress, destructive }: any) => (
    <TouchableOpacity style={styles.item} onPress={onPress}>
      <View style={[styles.iconContainer, destructive && styles.destructiveIcon]}>
        <Icon size={20} color={destructive ? Colors.error : Colors.primary} />
      </View>
      <Text style={[styles.itemLabel, destructive && { color: Colors.error }]}>{label}</Text>
      {!destructive && <Text style={styles.arrow}>›</Text>}
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <ChevronLeft size={28} color={Colors.text} />
        </TouchableOpacity>
        <Text style={Typography.h2}>Settings</Text>
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
            <SettingItem icon={User} label="Personal Information" />
            <View style={styles.divider} />
            <SettingItem icon={Bell} label="Notifications" />
            <View style={styles.divider} />
            <SettingItem icon={Shield} label="Privacy & Security" />
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Support</Text>
          <div style={styles.card}>
            <SettingItem icon={CircleHelp} label="Help Center" />
          </div>
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

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F2F2F7' }, // iOS Light Gray
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#fff',
  },
  backBtn: { padding: 4 },
  scrollContent: { padding: 16 },
  profileCard: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 24,
    alignItems: 'center',
    marginBottom: 24,
    // Subtle Apple shadow
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#E5E5EA',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  avatarText: { fontSize: 32, fontWeight: '600', color: '#8E8E93' },
  userName: { fontSize: 22, fontWeight: '700', color: Colors.text },
  userEmail: { fontSize: 15, color: '#8E8E93', marginTop: 4 },
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
    padding: 14,
    paddingHorizontal: 16,
  },
  iconContainer: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: '#F2F2F7',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  destructiveIcon: { backgroundColor: '#FF3B3015' },
  itemLabel: { flex: 1, fontSize: 17, color: Colors.text },
  arrow: { fontSize: 20, color: '#C7C7CC', fontWeight: '300' },
  divider: { height: 1, backgroundColor: '#F2F2F7', marginLeft: 60 },
  version: {
    textAlign: 'center',
    color: '#8E8E93',
    fontSize: 13,
    marginTop: 8,
    marginBottom: 32,
  },
});

export default SettingsScreen;
