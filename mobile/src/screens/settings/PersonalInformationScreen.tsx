import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, ScrollView, SafeAreaView, Alert, ActivityIndicator, StatusBar } from 'react-native';
import { useTheme } from '../../theme';
import { useAuth } from '../../store/AuthContext';
import client from '../../api/client';
import { ChevronLeft, Check } from 'lucide-react-native';

const PersonalInformationScreen = ({ navigation }: any) => {
  const { user, updateUser } = useAuth();
  const { colors, typography, isDark } = useTheme();
  
  const [loading, setLoading] = useState(false);
  
  const [formData, setFormData] = useState({
    name: user?.name || '',
    age: user?.profile?.age?.toString() || '',
    gender: user?.profile?.gender || '',
    height: user?.profile?.height?.toString() || '',
    weight: user?.profile?.weight?.toString() || '',
  });

  const handleSave = async () => {
    if (!formData.name) {
      Alert.alert("Error", "Name is required");
      return;
    }

    setLoading(true);
    try {
      const profileRes = await client.put('/user/profile', {
        age: formData.age ? parseInt(formData.age) : null,
        gender: formData.gender || null,
        height: formData.height ? parseFloat(formData.height) : null,
        weight: formData.weight ? parseFloat(formData.weight) : null,
      });

      if (profileRes.data.status === 'success') {
        const updatedUser = { 
          ...user, 
          name: formData.name,
          profile: { ...user.profile, ...profileRes.data.data } 
        };
        await updateUser(updatedUser);
        Alert.alert("Success", "Personal information updated successfully!");
        navigation.goBack();
      }
    } catch (error: any) {
      console.error('Update profile error', error);
      Alert.alert("Error", error.response?.data?.message || "Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  const InputField = ({ label, value, onChangeText, placeholder, keyboardType = 'default', editable = true }: any) => (
    <View style={styles.inputContainer}>
      <Text style={styles.labelText}>{label}</Text>
      <TextInput
        style={[styles.input, !editable && styles.disabledInput]}
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={colors.textSecondary}
        keyboardType={keyboardType}
        editable={editable}
      />
    </View>
  );

  const styles = getStyles(colors, typography);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle={isDark ? "light-content" : "dark-content"} />
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <ChevronLeft size={28} color={colors.text} />
        </TouchableOpacity>
        <Text style={typography.h2}>Personal Info</Text>
        <TouchableOpacity onPress={handleSave} disabled={loading}>
          {loading ? <ActivityIndicator size="small" color={colors.primary} /> : <Check size={24} color={colors.primary} />}
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.section}>
          <InputField 
            label="NAME" 
            value={formData.name} 
            onChangeText={(text: string) => setFormData({ ...formData, name: text })}
            placeholder="Your name"
          />
          <InputField 
            label="EMAIL" 
            value={user?.email} 
            editable={false}
            placeholder="Your email"
          />
          <View style={styles.noteContainer}>
            <Text style={styles.note}>Email cannot be changed for security reasons.</Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Physical Attributes (Metric)</Text>
          <View style={styles.row}>
            <View style={{ flex: 1 }}>
              <InputField 
                label="AGE" 
                value={formData.age} 
                onChangeText={(text: string) => setFormData({ ...formData, age: text })}
                placeholder="Years"
                keyboardType="numeric"
              />
            </View>
            <View style={{ width: 16 }} />
            <View style={{ flex: 1 }}>
               <Text style={styles.labelText}>GENDER</Text>
               <View style={styles.genderRow}>
                  {['Male', 'Female'].map((g) => (
                    <TouchableOpacity 
                      key={g} 
                      style={[styles.genderBtn, formData.gender === g && styles.genderBtnActive]}
                      onPress={() => setFormData({ ...formData, gender: g })}
                    >
                      <Text style={[styles.genderBtnText, formData.gender === g && styles.genderBtnTextActive]}>{g}</Text>
                    </TouchableOpacity>
                  ))}
               </View>
            </View>
          </View>

          <View style={styles.row}>
            <View style={{ flex: 1 }}>
              <InputField 
                label="HEIGHT (CM)" 
                value={formData.height} 
                onChangeText={(text: string) => setFormData({ ...formData, height: text })}
                placeholder="0"
                keyboardType="decimal-pad"
              />
            </View>
            <View style={{ width: 16 }} />
            <View style={{ flex: 1 }}>
              <InputField 
                label="WEIGHT (KG)" 
                value={formData.weight} 
                onChangeText={(text: string) => setFormData({ ...formData, weight: text })}
                placeholder="0"
                keyboardType="decimal-pad"
              />
            </View>
          </View>
        </View>

        <TouchableOpacity 
          style={[styles.saveBtn, loading && { opacity: 0.7 }]} 
          onPress={handleSave}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color={colors.white} />
          ) : (
            <Text style={styles.saveBtnText}>Save Changes</Text>
          )}
        </TouchableOpacity>
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
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  backBtn: { padding: 4 },
  scrollContent: { padding: 20 },
  section: {
    backgroundColor: colors.card,
    borderRadius: 20,
    padding: 20,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.textSecondary,
    marginBottom: 16,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  inputContainer: { marginBottom: 16 },
  labelText: { fontSize: 11, fontWeight: '700', color: colors.textSecondary, marginBottom: 6, textTransform: 'uppercase' },
  input: {
    fontSize: 17,
    color: colors.text,
    borderBottomWidth: 1,
    borderBottomColor: colors.background,
    paddingVertical: 8,
  },
  disabledInput: { color: colors.textSecondary, opacity: 0.6 },
  noteContainer: { marginTop: -8, marginBottom: 8 },
  note: { fontSize: 12, color: colors.textSecondary, fontStyle: 'italic' },
  row: { flexDirection: 'row', alignItems: 'flex-start' },
  genderRow: { flexDirection: 'row', gap: 8, marginTop: 4 },
  genderBtn: {
    flex: 1,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.background,
    alignItems: 'center',
    backgroundColor: colors.card,
  },
  genderBtnActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  genderBtnText: { fontSize: 13, fontWeight: '600', color: colors.textSecondary },
  genderBtnTextActive: { color: colors.white },
  saveBtn: {
    backgroundColor: colors.primary,
    padding: 16,
    borderRadius: 16,
    alignItems: 'center',
    marginTop: 8,
  },
  saveBtnText: { color: colors.white, fontSize: 17, fontWeight: '600' },
});

export default PersonalInformationScreen;
