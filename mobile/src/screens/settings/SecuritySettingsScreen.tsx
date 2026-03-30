import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, ScrollView, SafeAreaView, Alert, ActivityIndicator } from 'react-native';
import { Colors, Typography } from '../../theme';
import { useAuth } from '../../store/AuthContext';
import client from '../../api/client';
import { ChevronLeft, Lock, Trash2, ShieldAlert } from 'lucide-react-native';

const SecuritySettingsScreen = ({ navigation }: any) => {
  const { logout } = useAuth();
  const [loading, setLoading] = useState(false);
  const [passwordData, setPasswordData] = useState({
    oldPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const handleChangePassword = async () => {
    if (!passwordData.oldPassword || !passwordData.newPassword) {
      Alert.alert("Error", "All fields are required");
      return;
    }

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      Alert.alert("Error", "New passwords do not match");
      return;
    }

    setLoading(true);
    try {
      const res = await client.post('/user/change-password', {
        oldPassword: passwordData.oldPassword,
        newPassword: passwordData.newPassword,
      });

      if (res.data.status === 'success') {
        Alert.alert("Success", "Password changed successfully! Please log in again.", [
          { text: "OK", onPress: () => logout() }
        ]);
      }
    } catch (error: any) {
      Alert.alert("Error", error.response?.data?.message || "Failed to change password");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteAccount = () => {
    Alert.alert(
      "Delete Account?",
      "Are you absolutely sure? This will permanently delete all your health data, history, and goals. This cannot be undone.",
      [
        { text: "Cancel", style: "cancel" },
        { 
          text: "Delete My Data", 
          style: "destructive", 
          onPress: async () => {
            setLoading(true);
            try {
              await client.delete('/user');
              Alert.alert("Account Deleted", "Your account and data have been completely removed.");
              logout();
            } catch (error: any) {
              Alert.alert("Error", "Failed to delete account");
            } finally {
              setLoading(false);
            }
          } 
        }
      ]
    );
  };

  const InputField = ({ label, value, onChangeText, placeholder, secureTextEntry = true }: any) => (
    <View style={styles.inputContainer}>
      <Text style={styles.label}>{label}</Text>
      <TextInput
        style={styles.input}
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        secureTextEntry={secureTextEntry}
        placeholderTextColor="#C7C7CC"
      />
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <ChevronLeft size={28} color={Colors.text} />
        </TouchableOpacity>
        <Text style={Typography.h2}>Security</Text>
        <View style={{ width: 28 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Lock size={18} color={Colors.primary} />
            <Text style={styles.sectionTitle}>Change Password</Text>
          </View>
          <InputField 
            label="CURRENT PASSWORD" 
            value={passwordData.oldPassword} 
            onChangeText={(text: string) => setPasswordData({ ...passwordData, oldPassword: text })}
            placeholder="Required"
          />
          <InputField 
            label="NEW PASSWORD" 
            value={passwordData.newPassword} 
            onChangeText={(text: string) => setPasswordData({ ...passwordData, newPassword: text })}
            placeholder="Minimum 6 characters"
          />
          <InputField 
            label="CONFIRM NEW PASSWORD" 
            value={passwordData.confirmPassword} 
            onChangeText={(text: string) => setPasswordData({ ...passwordData, confirmPassword: text })}
            placeholder="Match new password"
          />
          
          <TouchableOpacity 
            style={[styles.actionBtn, loading && { opacity: 0.7 }]} 
            onPress={handleChangePassword}
            disabled={loading}
          >
            {loading ? <ActivityIndicator color={Colors.white} /> : <Text style={styles.actionBtnText}>Update Password</Text>}
          </TouchableOpacity>
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <ShieldAlert size={18} color={Colors.error} />
            <Text style={[styles.sectionTitle, { color: Colors.error }]}>Danger Zone</Text>
          </View>
          <Text style={styles.dangerNote}>Deleting your account will purge your database record on our Render server. Your friends will no longer see your activity.</Text>
          
          <TouchableOpacity 
            style={styles.deleteBtn} 
            onPress={handleDeleteAccount}
            disabled={loading}
          >
            <Trash2 size={18} color={Colors.error} />
            <Text style={styles.deleteBtnText}>Delete My Account</Text>
          </TouchableOpacity>
        </View>
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
  scrollContent: { padding: 20 },
  section: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 20,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
  },
  sectionHeader: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 20 },
  sectionTitle: { fontSize: 13, fontWeight: '700', color: '#8E8E93', textTransform: 'uppercase' },
  inputContainer: { marginBottom: 16 },
  label: { fontSize: 11, fontWeight: '700', color: '#8E8E93', marginBottom: 6 },
  input: {
    fontSize: 17,
    color: Colors.text,
    borderBottomWidth: 1,
    borderBottomColor: '#F2F2F7',
    paddingVertical: 8,
  },
  actionBtn: {
    backgroundColor: Colors.primary,
    padding: 14,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 8,
  },
  actionBtnText: { color: Colors.white, fontSize: 16, fontWeight: '600' },
  dangerNote: { fontSize: 13, color: '#8E8E93', marginBottom: 20, lineHeight: 18 },
  deleteBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 14,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.error,
    gap: 8,
  },
  deleteBtnText: { color: Colors.error, fontSize: 16, fontWeight: '600' },
});

export default SecuritySettingsScreen;
