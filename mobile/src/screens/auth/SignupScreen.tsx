import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, KeyboardAvoidingView, Platform, ScrollView, Alert } from 'react-native';
import { Colors, Typography } from '../../theme';
import client from '../../api/client';
import { useAuth } from '../../store/AuthContext';

const SignupScreen = ({ navigation }: any) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();

  const handleSignup = async () => {
    if (!name || !email || !password) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    setLoading(true);
    try {
      const response = await client.post('/auth/signup', { name, email, password });
      if (response.data.status === 'success') {
        const { user, token } = response.data.data;
        await login(user, token);
      } else {
        Alert.alert('Error', response.data.message || 'Signup failed');
      }
    } catch (error: any) {
      console.error('Signup error:', error);
      const msg = error.response?.data?.message || error.message || 'Check your internet connection';
      Alert.alert('Error', msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <Text style={Typography.h1}>Create Account</Text>
          <Text style={[Typography.caption, { marginTop: 8 }]}>Start your wellness journey today</Text>
        </View>

        <View style={styles.form}>
          <Text style={styles.label}>Full Name</Text>
          <TextInput
            style={styles.input}
            placeholder="John Doe"
            value={name}
            onChangeText={setName}
            autoCapitalize="words"
          />

          <Text style={styles.label}>Email Address</Text>
          <TextInput
            style={styles.input}
            placeholder="example@mail.com"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
          />

          <Text style={styles.label}>Password</Text>
          <TextInput
            style={styles.input}
            placeholder="********"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />

          <TouchableOpacity style={styles.button} onPress={handleSignup} disabled={loading}>
            <Text style={styles.buttonText}>{loading ? 'Creating account...' : 'Create Account'}</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => navigation.navigate('Login')} style={styles.footer}>
            <Text style={Typography.caption}>Already have an account? <Text style={styles.link}>Sign In</Text></Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.white },
  scrollContent: { padding: 24, paddingTop: 100 },
  header: { marginBottom: 40 },
  form: { gap: 16 },
  label: { fontSize: 14, fontWeight: '600', color: Colors.text, marginBottom: 4 },
  input: {
    height: 50,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 8,
    paddingHorizontal: 16,
    fontSize: 16,
    backgroundColor: Colors.surface,
  },
  button: {
    height: 50,
    backgroundColor: Colors.primary,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
  },
  buttonText: { color: Colors.white, fontSize: 16, fontWeight: '700' },
  footer: { alignItems: 'center', marginTop: 24 },
  link: { color: Colors.primary, fontWeight: '700' },
});

export default SignupScreen;
