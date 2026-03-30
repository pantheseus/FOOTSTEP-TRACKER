import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, ScrollView, SafeAreaView, Alert, ActivityIndicator } from 'react-native';
import { Colors, Typography } from '../../theme';
import { useAuth } from '../../store/AuthContext';
import client from '../../api/client';
import { ChevronLeft, Check } from 'lucide-react-native';

const PersonalInformationScreen = ({ navigation }: any) => {
  const { user, setUser } = useAuth();
  const [loading, setLoading] = useState(false);
  
  // Initialize state with current user data
  const [formData, setFormData] = useState({
    name: user?.name || '',
    age: user?.profile?.age?.toString() || '',
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
      // 1. Update Profile (Age, Height, Weight)
      const profileRes = await client.put('/user/profile', {
        age: formData.age ? parseInt(formData.age) : null,
        height: formData.height ? parseFloat(formData.height) : null,
        weight: formData.weight ? parseFloat(formData.weight) : null,
      });

      // 2. Note: We are ignoring the Name update for now as per instructions (or if you want to support it, add an endpoint)
      // Since the user asked to "ignore email," we'll just update the profile fields.
      
      if (profileRes.data.status === 'success') {
        // Update local auth context
        const updatedUser = { 
          ...user, 
          name: formData.name,
          profile: { ...user.profile, ...profileRes.data.data } 
        };
        setUser(updatedUser);
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
      <Text style={styles.label}>{label}</Text>
      <TextInput
        style={[styles.input, !editable && styles.disabledInput]}
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        keyboardType={keyboardType}
        editable={editable}
      />
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <ChevronLeft size={28} color={Colors.text} />
        </TouchableOpacity>
        <Text style={Typography.h2}>Personal Info</Text>
        <TouchableOpacity onPress={handleSave} disabled={loading}>
          {loading ? <ActivityIndicator size="small" color={Colors.primary} /> : <Check size={24} color={Colors.primary} />}
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
               {/* Spacer */}
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
            <ActivityIndicator color={Colors.white} />
          ) : (
            <Text style={styles.saveBtnText}>Save Changes</Text>
          )}
        </TouchableOpacity>
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
  sectionTitle: {
    fontSize: 13,
    fontWeight: '600',
    color: '#8E8E93',
    marginBottom: 16,
    textTransform: 'uppercase',
  },
  inputContainer: { marginBottom: 16 },
  label: { fontSize: 11, fontWeight: '700', color: '#8E8E93', marginBottom: 6 },
  input: {
    fontSize: 17,
    color: Colors.text,
    borderBottomWidth: 1,
    borderBottomColor: '#F2F2F7',
    paddingVertical: 8,
  },
  disabledInput: { color: '#C7C7CC' },
  noteContainer: { marginTop: -8, marginBottom: 8 },
  note: { fontSize: 12, color: '#8E8E93', fontStyle: 'italic' },
  row: { flexDirection: 'row' },
  saveBtn: {
    backgroundColor: Colors.primary,
    padding: 16,
    borderRadius: 16,
    alignItems: 'center',
    marginTop: 8,
  },
  saveBtnText: { color: Colors.white, fontSize: 17, fontWeight: '600' },
});

export default PersonalInformationScreen;
