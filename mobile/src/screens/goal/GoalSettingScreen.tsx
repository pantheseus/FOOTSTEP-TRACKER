import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView, Alert, ActivityIndicator } from 'react-native';
import { Colors, Typography } from '../../theme';
import client from '../../api/client';
import { ArrowLeft, Save, User, Calendar } from 'lucide-react-native';

const GoalSettingScreen = ({ navigation }: any) => {
  const [dailyGoal, setDailyGoal] = useState('5000');
  const [age, setAge] = useState('');
  const [gender, setGender] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const [goalRes, profileRes] = await Promise.all([
        client.get('/goals'),
        client.get('/user/profile')
      ]);

      if (goalRes.data.status === 'success') setDailyGoal(goalRes.data.data.daily_goal.toString());
      if (profileRes.data.status === 'success') {
        const { age, gender } = profileRes.data.data.profile || {};
        setAge(age ? age.toString() : '');
        setGender(gender || '');
      }
    } catch (error) {
      console.error('Error fetching profile', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!dailyGoal) {
      Alert.alert('Error', 'Please enter a daily goal');
      return;
    }

    setSaving(true);
    try {
      await Promise.all([
        client.post('/goals', { dailyGoal: parseInt(dailyGoal) }),
        client.put('/user/profile', { age: age ? parseInt(age) : null, gender: gender || null })
      ]);
      Alert.alert('Success', 'Profile and goal updated successfully');
      navigation.goBack();
    } catch (error) {
      Alert.alert('Error', 'Failed to save changes');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={Colors.primary} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <ArrowLeft size={24} color={Colors.text} />
        </TouchableOpacity>
        <Text style={Typography.h2}>Settings</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.section}>
          <View style={styles.sectionTitleRow}>
            <Calendar size={20} color={Colors.primary} />
            <Text style={styles.sectionTitle}>Daily Step Goal</Text>
          </View>
          <Text style={Typography.caption}>How many steps do you want to walk every day?</Text>
          <TextInput
            style={styles.input}
            value={dailyGoal}
            onChangeText={setDailyGoal}
            keyboardType="numeric"
            placeholder="5000"
          />
        </View>

        <View style={styles.section}>
          <View style={styles.sectionTitleRow}>
            <User size={20} color={Colors.primary} />
            <Text style={styles.sectionTitle}>Personal Info (Optional)</Text>
          </View>
          
          <Text style={styles.label}>Age</Text>
          <TextInput
            style={styles.input}
            value={age}
            onChangeText={setAge}
            keyboardType="numeric"
            placeholder="25"
          />

          <Text style={styles.label}>Gender</Text>
          <View style={styles.genderRow}>
            {['Male', 'Female', 'Other'].map((item) => (
              <TouchableOpacity 
                key={item}
                style={[styles.genderBtn, gender === item && styles.genderBtnActive]}
                onPress={() => setGender(item)}
              >
                <Text style={[styles.genderText, gender === item && styles.genderTextActive]}>{item}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={styles.section}>
          <View style={styles.sectionTitleRow}>
            <Calendar size={20} color={Colors.primary} />
            <Text style={styles.sectionTitle}>Daily Reminder</Text>
          </View>
          <Text style={Typography.caption}>Receive a notification to stay active</Text>
          <View style={styles.reminderRow}>
             <Text style={styles.reminderLabel}>Simple Daily Reminder</Text>
             <TouchableOpacity style={styles.toggleBtn}>
                <View style={[styles.toggleCircle, { backgroundColor: Colors.primary }]} />
             </TouchableOpacity>
          </View>
        </View>

        <TouchableOpacity style={styles.saveBtn} onPress={handleSave} disabled={saving}>
          <Save size={20} color={Colors.white} />
          <Text style={styles.saveText}>{saving ? 'Saving...' : 'Save Changes'}</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.white },
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  header: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center', 
    padding: 24, 
    paddingTop: 60,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  scrollContent: { padding: 24 },
  section: { marginBottom: 32 },
  sectionTitleRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 8 },
  sectionTitle: { fontSize: 18, fontWeight: '700', color: Colors.text },
  label: { fontSize: 14, fontWeight: '600', color: Colors.text, marginBottom: 8, marginTop: 16 },
  input: {
    height: 50,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 8,
    paddingHorizontal: 16,
    fontSize: 16,
    marginTop: 8,
    backgroundColor: Colors.surface,
  },
  genderRow: { flexDirection: 'row', gap: 12, marginTop: 8 },
  genderBtn: {
    flex: 1,
    height: 45,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: Colors.border,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.surface,
  },
  genderBtnActive: { backgroundColor: Colors.primary, borderColor: Colors.primary },
  genderText: { color: Colors.text, fontWeight: '600' },
  genderTextActive: { color: Colors.white },
  saveBtn: {
    height: 55,
    backgroundColor: Colors.primary,
    borderRadius: 12,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
    marginTop: 20,
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  saveText: { color: Colors.white, fontSize: 16, fontWeight: '700' },
  reminderRow: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center', 
    marginTop: 16,
    padding: 16,
    backgroundColor: Colors.surface,
    borderRadius: 12,
  },
  reminderLabel: { fontSize: 16, fontWeight: '600', color: Colors.text },
  toggleBtn: {
    width: 50,
    height: 28,
    borderRadius: 14,
    backgroundColor: Colors.border,
    padding: 2,
    justifyContent: 'center',
  },
  toggleCircle: {
    width: 24,
    height: 24,
    borderRadius: 12,
    alignSelf: 'flex-end',
  },
});

export default GoalSettingScreen;
