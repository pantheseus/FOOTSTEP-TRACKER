import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView, Alert, ActivityIndicator, SafeAreaView, StatusBar } from 'react-native';
import { useTheme } from '../../theme';
import client from '../../api/client';
import { ArrowLeft, Target } from 'lucide-react-native';

const GoalSettingScreen = ({ navigation }: any) => {
  const { colors, typography, isDark } = useTheme();
  
  const [dailyGoal, setDailyGoal] = useState('5000');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const fetchGoal = async () => {
      try {
        const res = await client.get('/goals');
        if (res.data.status === 'success') {
          setDailyGoal(res.data.data.daily_goal.toString());
        }
      } catch (error) {
        console.error('Error fetching goal', error);
      } finally {
        setLoading(false);
      }
    };
    fetchGoal();
  }, []);

  const handleSave = async () => {
    if (!dailyGoal || isNaN(parseInt(dailyGoal))) {
      Alert.alert('Error', 'Please enter a valid step goal');
      return;
    }

    setSaving(true);
    try {
      await client.post('/goals', { dailyGoal: parseInt(dailyGoal) });
      Alert.alert('Success', 'Daily goal updated successfully');
      navigation.goBack();
    } catch (error) {
      Alert.alert('Error', 'Failed to save changes');
    } finally {
      setSaving(false);
    }
  };

  const styles = getStyles(colors, typography);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle={isDark ? "light-content" : "dark-content"} />
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <ArrowLeft size={28} color={colors.text} />
        </TouchableOpacity>
        <Text style={typography.h2}>Step Goal</Text>
        <View style={{ width: 28 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.promoCard}>
          <Target size={48} color={colors.white} />
          <Text style={styles.promoTitle}>Set your target</Text>
          <Text style={styles.promoSubtitle}>Consistency is key to a healthy lifestyle.</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.label}>DAILY STEP GOAL</Text>
          <TextInput
            style={styles.input}
            value={dailyGoal}
            onChangeText={setDailyGoal}
            keyboardType="numeric"
            placeholder="5000"
            placeholderTextColor={colors.textSecondary}
          />
          <Text style={styles.infoText}>We recommend at least 5,000 steps for moderate activity.</Text>
        </View>

        <TouchableOpacity 
          style={[styles.saveBtn, saving && { opacity: 0.7 }]} 
          onPress={handleSave} 
          disabled={saving}
        >
          {saving ? <ActivityIndicator color={colors.white} /> : <Text style={styles.saveText}>Update Goal</Text>}
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

const getStyles = (colors: any, typography: any) => StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: colors.background },
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
  scrollContent: { padding: 20 },
  promoCard: {
    backgroundColor: colors.primary,
    borderRadius: 24,
    padding: 32,
    alignItems: 'center',
    marginBottom: 24,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 5,
  },
  promoTitle: { fontSize: 24, fontWeight: '800', color: colors.white, marginTop: 16 },
  promoSubtitle: { fontSize: 14, color: colors.white, opacity: 0.8, marginTop: 4, textAlign: 'center' },
  section: {
    backgroundColor: colors.card,
    borderRadius: 20,
    padding: 32,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
  },
  label: { fontSize: 11, fontWeight: '700', color: colors.textSecondary, marginBottom: 12 },
  input: {
    fontSize: 48,
    fontWeight: '800',
    color: colors.text,
    borderBottomWidth: 2,
    borderBottomColor: colors.background,
    paddingVertical: 12,
    textAlign: 'center',
  },
  infoText: { fontSize: 13, color: colors.textSecondary, textAlign: 'center', marginTop: 16 },
  saveBtn: {
    backgroundColor: colors.primary,
    padding: 16,
    borderRadius: 16,
    alignItems: 'center',
    marginTop: 16,
  },
  saveText: { color: colors.white, fontSize: 17, fontWeight: '600' },
});

export default GoalSettingScreen;
